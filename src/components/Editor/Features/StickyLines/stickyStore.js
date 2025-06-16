import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import Logger from "../../../../util/logger";
const logger = new Logger("StickyLineStore");

// MARK: DEFAULT PROPS
const DEFAULT_PROPS = {
	sections: new Map(), // Maps sectionId -> { lines, firstLine object, lastLine object, positions, etc }

	stickyLines: new Map(), // Maps lineId -> { sectionId, element, lineNumber, offset,}

	systemInitialized: false,

	sectionRegistrations: new Map(), // Maps sectionId -> { pendingLines: Map(lineId -> {lineNumber, element}), isReady: boolean }

	sortedSections: [], // sectionId in order of position, ascending
};

export const createStickyLineStore = (initProps, fileBoundingRectStoreAPI) => {
	logger.debug("Creating sticky line store with initial props:", initProps);

	const store = createStore(
		devtools(
			subscribeWithSelector(
				(set, get) => {
					return {
						...DEFAULT_PROPS,
						...initProps,

						// MARK: Initialize
						initialize: () => {
							logger.suffix("initialize");
							logger.info("System inititalizing");

							set(
								{
									systemInitialized: true,
								},
								undefined,
								"sticky/initialize"
							);
						},

						// MARK: Register Section
						// Register a new section
						registerSection: (sectionId, sectionData) => {
							logger.suffix("registerSection");
							logger.debug(`${sectionId}`, {
								parentSection: sectionData.parentSectionId,
							});

							set(
								(state) => {
									const newSections = new Map(state.sections);
									const newSectionRegistrations = new Map(
										state.sectionRegistrations
									);

									if (!newSections.has(sectionId)) {
										logger.debug(
											`Creating new section: ${sectionId}`
										);

										newSections.set(sectionId, {
											id: sectionId,
											lines: [],
											firstLine: null,
											lastLine: null,
											positions: {
												sectionTop: 0,
												sectionBottom: 0,
												firstLineHeight: 0,
												lastLineHeight: 0,
											},
											isSticky: false,
											isFinalized: false,
											parentSection: {
												id: sectionData.parentSectionId,
											},
										});
									} else {
										logger.debug(
											`Section ${sectionId} already exists, updating`
										);
									}

									newSectionRegistrations.set(sectionId, {
										pendingLines: new Map(), // lineId -> {lineNumber, element}
										pendingCount: 0,
										isReady: false,
									});

									const newSortedSections = [
										...state.sortedSections,
										sectionId,
									];

									return {
										sections: newSections,
										sectionRegistrations:
											newSectionRegistrations,
										sortedSections: newSortedSections,
									};
								},
								undefined,
								"sticky/registerSection"
							);

							return () => get().unregisterSection(sectionId);
							// return true;
						},

						// MARK: Unregister Section
						// Unregister a section
						unregisterSection: (sectionId) => {
							logger.suffix("unregisterSection");
							logger.debug(`Unregistering section: ${sectionId}`);

							set(
								(state) => {
									const newSections = new Map(state.sections);
									const newSectionRegistrations = new Map(
										state.sectionRegistrations
									);

									if (
										!newSections.has(sectionId) ||
										!newSectionRegistrations.has(sectionId)
									) {
										logger.warn(
											`Cannot unregister section ${sectionId} - not found`
										);
										return state;
									}

									newSections.delete(sectionId);
									newSectionRegistrations.delete(sectionId);

									const newSortedSections = [
										...state.sortedSections,
									].filter((id) => id !== sectionId);

									return {
										sections: newSections,
										sectionRegistrations:
											newSectionRegistrations,
										sortedSections: newSortedSections,
									};
								},
								undefined,
								"sticky/unregisterSection"
							);
						},

						// MARK: Signal Registration Intent
						// Signal intent to register by adding to the sectionRegistrations pendingLines
						signalRegistrationIntent: (sectionId, lineData) => {
							logger.suffix("signalRegistrationIntent");
							logger.debug(
								`Signaling intent for ${lineData?.lineId} in ${sectionId} (#${lineData?.lineNumber})`
							);

							const { lineId } = lineData;
							const { sectionRegistrations } = get();

							const newSectionRegistrations = new Map(
								sectionRegistrations
							);
							// const newSectionRegistrations = sectionRegistrations;
							const registration =
								newSectionRegistrations.get(sectionId);

							if (!registration) {
								logger.warn(
									"No registration found for",
									sectionId
								);
								return;
							}

							// const newPendingLines = registration.pendingLines;
							const newPendingLines = new Map(
								registration.pendingLines
							);
							newPendingLines.set(lineId, lineData);

							const newCount = registration.pendingCount + 1;

							newSectionRegistrations.set(sectionId, {
								...registration,
								pendingLines: newPendingLines,
								pendingCount: newCount,
							});

							set(
								{
									sectionRegistrations:
										newSectionRegistrations,
								},
								undefined,
								"sticky/signalRegistrationIntent"
							);

							logger.trace(
								`Registration intent signaled. Pending count: ${newCount}`
							);
							return newPendingLines.size;
						},

						// MARK: Complete Registration Intent
						// Complete a line's registration intent by decreasing count and determine if section is ready
						completeRegistrationIntent: (sectionId, lineId) => {
							logger.suffix("completeRegistrationIntent");
							logger.debug(
								`Completing intent for ${lineId} in ${sectionId}`
							);

							const { sectionRegistrations, sections } = get();

							const newSectionRegistrations = new Map(
								sectionRegistrations
							);
							const registration =
								newSectionRegistrations.get(sectionId);

							if (!registration) {
								logger.warn(
									`No registration found for ${sectionId}`
								);
								return;
							}

							if (registration?.pendingLines?.size > 0) {
								const newCount = registration.pendingCount - 1;
								const isReady = newCount === 0;

								logger.trace(
									`Pending count: ${
										registration.pendingCount
									} → ${newCount}${isReady ? " (READY)" : ""}`
								);

								newSectionRegistrations.set(sectionId, {
									...registration,
									pendingCount: newCount,
									isReady,
								});

								if (isReady) {
									logger.debug(
										`Section ${sectionId} is ready for finalization`
									);
								}
							}

							set(
								{
									sectionRegistrations:
										newSectionRegistrations,
								},
								undefined,
								"sticky/completeRegistrationIntent"
							);
						},

						// MARK: Register Line
						// Note: not all lines are officially "registered"
						// 1. Validate inputs
						// 2. Add to section's lines
						// 3. Determine first/last status
						// 4. Update section
						registerLine: (sectionId, lineMeta) => {
							logger.suffix("registerLine");
							const { lineId, lineRef, lineNumber } = lineMeta;

							const lineElement = lineRef.current;
							if (
								!sectionId ||
								!lineId ||
								!lineElement ||
								!lineNumber
							) {
								logger.warn(
									"Attempted to register line with missing parameters",
									{
										sectionId,
										lineId,
										hasElement: !!lineElement,
										lineNumber,
									}
								);
								return;
							}

							logger.trace(
								`Registering ${lineId} (#${lineNumber}) in ${sectionId}`
							);

							let lineRect;

							set(
								(state) => {
									const section =
										state.sections.get(sectionId);

									// Skip if section is not registered or line already registered
									if (!section) {
										logger.warn(
											`Cannot register ${lineId} - ${sectionId} not found`
										);
										return state;
									}

									if (
										section?.lines?.some(
											(line) => line.lineId === lineId
										)
									) {
										logger.trace(
											`${lineId} already registered, skipping`
										);
										return state;
									}

									// 1. Update the sections map
									const newSections = new Map(state.sections);
									const updatedSection = {
										...section,
									};

									// Add line to section lines
									const newLineMeta = {
										...lineMeta,
										element: lineElement,
									};
									delete newLineMeta.lineRef;

									const newSectionLines = [
										...updatedSection.lines,
										newLineMeta,
									];
									updatedSection.lines = newSectionLines;

									const isFirstLine =
										newSectionLines.length === 1 &&
										newSectionLines[0]?.lineId === lineId;
									if (isFirstLine) {
										updatedSection.firstLine = newLineMeta;
										logger.trace(
											`${lineId} set as first line for ${sectionId}`
										);
									}
									const isLastLine =
										newSectionLines[
											newSectionLines.length - 1
										]?.lineId === lineId;
									if (isLastLine) {
										updatedSection.lastLine = newLineMeta;
										logger.trace(
											`${lineId} set as last line for  ${sectionId}`
										);
									}

									newSections.set(sectionId, updatedSection);

									return {
										sections: newSections,
									};
								},
								undefined,
								"sticky/registerLine"
							);

							logger.trace(
								`Line ${lineId} (#${lineNumber}) registered in ${sectionId}`
							);

							return {
								isFirst: () => get().isFirstLine(lineId),
								isLast: () => get().isLastLine(lineId),
								getState: () => {},
							};
						},

						// MARK: Unregister Line
						unregisterLine: (lineId, sectionId) => {
							logger.suffix("unregisterLine");
							logger.debug(
								`Unregistering ${lineId} from ${sectionId}`
							);

							const { sections, sectionRegistrations } = get();

							const lineData = sectionRegistrations
								.get(sectionId)
								?.pendingLines.get(lineId);

							if (!lineData) {
								logger.warn(
									`No line data found for ${lineId} in ${sectionId}`
								);
								return;
							}

							const section = sections.get(sectionId);

							// Remove from registry
							set(
								(state) => {
									const newSectionRegistrations = new Map(
										state.sectionRegistrations
									);
									const registration =
										newSectionRegistrations.get(sectionId);

									if (registration) {
										const updatedRegistration = {
											...registration,
										};

										const newPendingLines = new Map(
											registration?.pendingLines
										);
										newPendingLines.delete(lineId);

										updatedRegistration.pendingCount =
											Math.max(
												0,
												registration?.pendingCount - 1
											);

										newSectionRegistrations.set(
											sectionId,
											updatedRegistration
										);

										logger.trace(
											`Pending count decreased to ${updatedRegistration.pendingCount}`
										);
									}

									return {
										sectionRegistrations:
											newSectionRegistrations,
									};
								},
								undefined,
								"sticky/unregisterLine"
							);

							if (section?.isFinalized) {
								const wasFirst =
									section?.firstLine?.lineId === lineId;
								const wasLast =
									section?.lastLine?.lineId === lineId;

								if (wasFirst || wasLast) {
									logger.debug(
										"Removed boundary line, going to re-finalize section",
										sectionId
									);
									get().finalizeSection(sectionId);
								}
							}
						},

						// MARK: Finalize Section
						// Processes the section registrations to set first/last line pointers and measure
						finalizeSection: (sectionId) => {
							logger.suffix("finalizeSection");
							logger.debug(`Finalizing ${sectionId}`);

							const {
								sectionRegistrations,
								measureSection,
								registerLine,
							} = get();

							const registration =
								sectionRegistrations.get(sectionId);

							if (!registration) {
								logger.warn(
									`No registration found for ${sectionId}`
								);
								return;
							}

							if (!registration.isReady) {
								logger.warn(
									`${sectionId} not ready for finalization (pending: ${registration.pendingCount})`
								);
								return;
							}

							// sort lines by lineNumber asc
							const lines = Array.from(
								registration.pendingLines.values()
							).sort((a, b) => a.lineNumber - b.lineNumber);

							if (lines.length === 0) {
								logger.warn(`No lines found for ${sectionId}`);
								return;
							}

							const linesToRegister = [
								lines[0],
								lines[lines.length - 1],
							];
							logger.debug(
								`Registering ${linesToRegister.length} boundary lines for ${sectionId}`
							);

							linesToRegister.forEach((lineMeta) => {
								registerLine(sectionId, lineMeta);
							});

							const newSections = new Map(get().sections);
							const section = newSections.get(sectionId);
							const updatedSection = {
								...section,
								isFinalized: true,
							};

							newSections.set(sectionId, updatedSection);

							set(
								{
									sections: newSections,
								},
								undefined,
								"sticky/finalizeSection"
							);

							// requestAnimationFrame(() => {
							measureSection(sectionId);
							// })
						},

						// MARK: Measure Section
						measureSection: (sectionId, fileState = null) => {
							logger.suffix("measureSection");
							logger.debug(`${sectionId}`);

							const state = get();
							const section = state.sections.get(sectionId);
							if (!section || !section?.isFinalized) {
								logger.warn(
									`Cannot measure section ${sectionId} - not found or not ready`
								);
								return;
							}

							console.log(section);

							if (!fileState) {
								logger.trace(
									`Retrieving file state from fileBoundingRectStoreAPI`
								);
								fileState = fileBoundingRectStoreAPI.getState();
							}

							const {
								__ref: fileContainer,
								rect: fileContainerRect,
							} = fileState;

							if (!fileContainer || !fileContainerRect) {
								logger.warn(
									`Missing file container or rect for measurement`,
									{
										hasContainer: !!fileContainer,
										hasRect: !!fileContainerRect,
									}
								);
								return;
							}

							// Get first line element
							const firstLineId = section.firstLine?.lineId;
							const lastLineId = section.lastLine?.lineId;

							if (!firstLineId || !lastLineId) {
								logger.warn(
									`${sectionId} missing boundary line references`,
									{
										firstLineId,
										lastLineId,
									}
								);
								return;
							}

							const firstLine = section.firstLine;
							const lastLine = section.lastLine;
							if (
								!firstLine ||
								!firstLine.element ||
								!lastLine ||
								!lastLine.element
							) {
								logger.warn(
									`Missing line elements for measurement`,
									{
										hasFirstLine: !!firstLine,
										hasFirstElement: !!firstLine?.element,
										hasLastLine: !!lastLine,
										hasLastElement: !!lastLine?.element,
									}
								);
								return;
							}

							// Measure positions
							const firstLineRect =
								firstLine.element.getBoundingClientRect();
							const lastLineRect =
								lastLine.element.getBoundingClientRect();

							// Calculate positions relative to the container
							const sectionTop =
								firstLineRect.top -
								fileContainerRect.top +
								fileContainer.scrollTop;
							const sectionBottom =
								lastLineRect.bottom -
								fileContainerRect.top +
								fileContainer.scrollTop;

							const phaseStart =
								lastLineRect.top -
								fileContainerRect.top +
								fileContainer.scrollTop;
							const phaseEnd =
								lastLineRect.bottom -
								fileContainerRect.top +
								fileContainer.scrollTop;

							const adjustedTop = sectionTop;
							const adjustedBottom =
								sectionBottom - lastLineRect.height;

							const contentsTop =
								sectionTop - firstLineRect.height;
							const contentsBottom = sectionBottom;

							// Create a new positions object
							const positions = {
								sectionTop,
								sectionBottom,
								phaseStart,
								phaseEnd,
								firstLineHeight: firstLineRect.height,
								lastLineHeight: lastLineRect.height,
							};

							logger.trace(`${sectionId} measurements:`, {
								sectionTop,
								sectionBottom,
								height: sectionBottom - sectionTop,
								firstLineHeight: firstLineRect.height,
								lastLineHeight: lastLineRect.height,
							});

							set(
								(state) => {
									if (!state.sections.has(sectionId)) {
										logger.warn(
											`${sectionId} no longer exists, canceling measurement update`
										);
										return state;
									}

									const newSections = new Map(state.sections);

									newSections.set(sectionId, {
										...newSections.get(sectionId),
										positions,
									});

									// Re-sort the section IDs array based on sectionTop
									const newSortedSections = [
										...state.sortedSections,
									].sort((a, b) => {
										const sectionA = newSections.get(a);
										const sectionB = newSections.get(b);
										return (
											(sectionA?.positions?.sectionTop ||
												0) -
											(sectionB?.positions?.sectionTop ||
												0)
										);
									});

									logger.trace(
										`Section order updated: ${newSortedSections.join(
											", "
										)}`
									);

									return {
										sections: newSections,
										sortedSections: newSortedSections,
									};
								},
								undefined,
								"sticky/measureSection"
							);

							return positions;
						},

						// MARK: Refresh Sections
						refreshSections: (fileState = null) => {
							logger.suffix("refreshSections");
							logger.info("Refreshing all sections");

							const { sections, measureSection } = get();
							let refreshedCount = 0;

							// Re-measure sections that have been finalized
							for (const [sectionId, section] of sections) {
								measureSection(sectionId, fileState);
								refreshedCount++;
							}

							logger.info(
								`Refreshed ${refreshedCount} of ${sections.size} sections`
							);
						},

						// MARK: Handle Scroll
						handleScroll: (scrollTop, direction) => {
							logger.suffix("handleScroll");
							logger.trace(
								`scrollTop: ${scrollTop}, direction: ${direction}`
							);

							const state = get();

							if (!state.systemInitialized) {
								logger.trace(
									`System not initialized, skipping scroll handling`
								);
								return;
							}

							// If we don't have scroll position, try to get it from the file container
							if (scrollTop === undefined) {
								const { __ref: fileContainer } =
									fileBoundingRectStoreAPI.getState();

								if (fileContainer) {
									scrollTop = fileContainer.scrollTop;
									logger.trace(
										`Retrieved scrollTop from container: ${scrollTop}`
									);
								} else {
									logger.warn(
										"Cannot determine scroll position - no fileContainer available"
									);
									return; // Can't determine scroll position
								}
							}

							const newStickyLines = new Map();

							let stickyHeight = Array.from(
								state.stickyLines.entries()
							).reduce((totalHeight, [lineId, line]) => {
								if (line.isPhasing) return totalHeight;
								return totalHeight + (line.height || 0);
							}, 0);

							let totalOffset = 0;

							// Check each section to see if it should be sticky
							state.sortedSections.forEach((sectionId) => {
								const section = state.sections.get(sectionId);
								if (
									!section.positions ||
									!section.positions?.firstLineHeight ||
									!section.isFinalized
								) {
									return;
								}

								// effective determines when it should "stick"

								const effectiveTop =
									section.positions.sectionTop - totalOffset;

								// bottom changes depending on direction
								// - scrolling down (1): bottom of last line
								// - scrolling up (-1): bottom minus the last line height, ie top of the last line
								const effectiveBottom =
									direction === 1
										? section.positions.sectionBottom -
										  totalOffset
										: section.positions.sectionBottom -
										  section.positions.lastLineHeight -
										  totalOffset;

								const isSticky =
									scrollTop > effectiveTop &&
									scrollTop < effectiveBottom;

								// Mark section as sticky if needed
								if (isSticky) {
									logger.trace(
										`Section is sticky ${sectionId}, ${section.positions.sectionTop} < ${scrollTop} < ${section.positions.sectionBottom}`
									);

									const phaseOutStart =
										section.positions.sectionBottom -
										section.positions.lastLineHeight -
										totalOffset -
										section.positions.firstLineHeight;
									const phaseOutEnd =
										section.positions.sectionBottom -
										totalOffset;

									const isPhasing =
										scrollTop >= phaseOutStart &&
										scrollTop < phaseOutEnd;

									const distanceIntoPhaseOut =
										scrollTop - phaseOutStart;
									// Calculate how far through the phase-out zone we are (0 to 1)
									const phaseOutZoneHeight =
										phaseOutEnd - phaseOutStart;

									// Calculate the difference as a value between 0 and 1
									// 0 = just starting to phase out, 1 = completely phased out
									const phaseDiff = Math.max(
										0,
										distanceIntoPhaseOut /
											phaseOutZoneHeight
									).toFixed(4);

									// You might also want the actual pixel difference for positioning
									const pixelDiff =
										distanceIntoPhaseOut.toFixed(4);

									if (isPhasing) {
										logger.trace(
											`${sectionId} phasing out: ${pixelDiff}px, ${phaseDiff}, ${
												phaseDiff * 100
											}%`
										);
									}

									// Add section first line to sticky lines
									if (section.firstLine) {
										newStickyLines.set(
											section.firstLine.lineId,
											{
												...section.firstLine,
												height: section.positions
													.firstLineHeight,
												offset: totalOffset,
												effectiveTop,
												effectiveBottom,
												totalOffset,
												isPhasing,
												pixelDiff,
												phaseDiff,
												phaseOutStart,
												phaseOutEnd,
											}
										);
									} else {
										logger.warn(
											`Section ${sectionId} is sticky but has no firstLine`
										);
									}

									stickyHeight +=
										section.positions.firstLineHeight;

									if (!isPhasing) {
										totalOffset +=
											section.positions.firstLineHeight;
									}
								}
							});

							// Compare newStickyLines to previous stickyLines
							const stickyLinesChanged =
								newStickyLines.size !==
									state.stickyLines.size ||
								[...newStickyLines.entries()].some(
									([key, newVal]) => {
										const oldVal =
											state.stickyLines.get(key);
										return (
											!oldVal ||
											newVal?.pixelDiff !==
												oldVal?.pixelDiff ||
											newVal.height !== oldVal.height ||
											newVal.offset !== oldVal.offset
										);
									}
								);

							if (stickyLinesChanged) {
								logger.debug(
									`Sticky lines updated: ${newStickyLines.size} sticky sections`
								);
								return set(
									{
										stickyLines: newStickyLines,
									},
									undefined,
									"sticky/handleScroll"
								);
							} else {
								logger.trace("no sticky lines changed");
							}
						},
					};
				},
				{
					name: "sticky-store",
					serialize: {
						options: true,
					},
				}
			)
		)
	);

	return store;
};

// MARK: CONTEXT
export const StickyLineContext = createContext(null);

export const useStickyLineStore = (selector) => {
	const store = useContext(StickyLineContext);
	if (!store)
		throw new Error("Missing StickyLineContext.Provider in the tree");
	return useStore(store, selector);
};

export const useStickyLineStoreInstance = () => {
	const store = useContext(StickyLineContext);
	if (!store)
		throw new Error("Missing StickyLineContext.Provider in the tree");
	return store;
};
