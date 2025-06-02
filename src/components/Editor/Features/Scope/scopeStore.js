import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { devtools } from "zustand/middleware";

import Logger from "../../../../util/logger";
const logger = new Logger("ScopeStore");

const DEFAULT_PROPS = {
	scopes: new Map(),
	lines: new Map(),
	collapsedScopes: new Set(),
};

const DEFAULT_COLOR = -1;

export const ScopeStoreContext = createContext(null);
export const useScopeStore = (selector) => {
	const store = useContext(ScopeStoreContext);
	if (!store) {
		logger.error("Missing ScopeStoreContext.Provider in the tree");
		throw new Error("Missing ScopeStoreContext.Provider in the tree");
	}
	return useStore(store, selector);
};

export const createScopeStore = (initProps) => {
	logger.info("Creating scope store");
	return createStore(
		devtools(
			(set, get) => ({
				...DEFAULT_PROPS,
				...initProps,

				reset: () => {
					logger.info("Resetting scope store to default state");
					set(DEFAULT_PROPS);
				},

				registerScope: (
					scopeId,
					parentScopeId = null,
					bracketDepth = 0
				) => {
					logger.suffix("registerScope");
					const { scopes } = get();

					// Don't register the same scope twice
					if (scopes.has(scopeId)) {
						logger.debug(
							`Scope ${scopeId} already registered, skipping`
						);
						return;
					}

					// Get parent scope information
					const parentScope = parentScopeId
						? scopes.get(parentScopeId)
						: null;

					if (parentScopeId && !parentScope) {
						logger.warn(
							`Parent scope ${parentScopeId} not found for scope ${scopeId}`
						);
					}

					const parentScopeColors = parentScope
						? [
								...(parentScope.parentScope.colors || []),
								parentScope.color,
						  ]
						: [];

					const parentIndentations = parentScope
						? [
								...(parentScope.parentScope.indentations || []),
								{
									scopeId: parentScopeId,
									colorId: parentScope.color,
								},
						  ]
						: [];

					const newScopes = new Map(scopes);
					newScopes.set(scopeId, {
						scopeId,
						parentScope: {
							id: parentScopeId,
							indentations: parentIndentations,
							colors: parentScopeColors,
							bracketInfo: parentScope?.bracketInfo,
						},
						lines: [],
						firstLineId: null,
						lastLineId: null,
						isWithinReturn:
							parentScope?.bracketInfo?.character === "(" ||
							parentScope?.isWithinReturn,
						bracketDepth,
						color: DEFAULT_COLOR, // Will be overwritten by first line
						isGreyed: true,
					});

					logger.debug(
						`Registered new scope ${scopeId}${
							parentScopeId
								? ` with parent ${parentScopeId}`
								: " as root scope"
						}`
					);
					set({ scopes: newScopes });

					return scopeId;
				},

				registerLine: (scopeId, lineId, lineNumber) => {
					logger.suffix("registerLine");
					const { scopes, lines } = get();

					if (!scopes.has(scopeId)) {
						logger.warn(
							`Attempted to register line ${lineId} to non-existent scope ${scopeId}`
						);
						return;
					}

					const newScopes = new Map(scopes);
					const newLinesMap = new Map(lines);

					const scope = scopes.get(scopeId);
					const scopeLines = scope.lines;
					const isNewLine = !scopeLines.includes(lineId);

					let isFirstLine;

					if (isNewLine) {
						const newScopeLines = [...scope.lines, lineId];

						// Update first and last line IDs
						isFirstLine = newScopeLines.length === 1;
						const firstLineId = isFirstLine
							? lineId
							: scope.firstLineId;
						const lastLineId = lineId; // Always the most recently added

						// Update scope
						newScopes.set(scopeId, {
							...scope,
							lines: newScopeLines,
							firstLineId,
							lastLineId,
						});

						// Update line
						newLinesMap.set(lineId, {
							scopeId,
							lineNumber,
						});

						logger.debug(
							`Registered new line ${lineId} (number ${lineNumber}) to scope ${scopeId}${
								isFirstLine ? " as first line" : ""
							}`
						);
					} else {
						// Line already exists, update line number
						const lineInfo = newLinesMap.get(lineId);
						if (lineInfo) {
							const updatedLineInfo = {
								...lineInfo,
								lineNumber,
							};
							newLinesMap.set(lineId, updatedLineInfo);
							logger.trace(
								`Updated line ${lineId} number from ${lineInfo.lineNumber} to ${lineNumber}`
							);
						}
					}

					set({ scopes: newScopes, lines: newLinesMap });

					return isFirstLine;
				},

				/**
				 * Conditional return on four conditions:
				 * 1. Scope doesn't exist
				 * 2. The argument "bracketInfo" doesn't exist
				 * 3. BracketInfo does not contain "color" property
				 * 4. BracketInfo is not an opening bracket
				 */
				setScopeColor: (scopeId, lineId, bracketInfo = null) => {
					logger.suffix("setScopeColor");
					const { scopes } = get();

					logger.debug(
						`Setting color for scope ${scopeId}, line ${lineId}`
					);
					logger.trace("bracketInfo:", bracketInfo);

					if (
						!scopes.has(scopeId) ||
						!bracketInfo ||
						!bracketInfo.hasOwnProperty("color") ||
						!bracketInfo.isOpening
					) {
						logger.warn(
							"Attempted to set color on non-existent scope or invalid bracketInfo"
						);
						return;
					}

					const scope = scopes.get(scopeId);
					const isFirstLineOfScope = scope.firstLineId === lineId;

					logger.trace(
						`Scope ${scopeId} current color: ${scope.color}, new color: ${bracketInfo.color}`
					);
					logger.trace(
						`Is first line of scope: ${isFirstLineOfScope}`
					);

					/**  Only update color if any of the following conditions are met:
					 * 1. This is the first line of the scope,
					 * 2. The scope has no color yet,
					 * 3. The scope has the default color and this bracket has a real color
					 */
					if (
						isFirstLineOfScope ||
						!scope.hasOwnProperty("color") ||
						(scope.color === DEFAULT_COLOR &&
							bracketInfo.color !== DEFAULT_COLOR)
					) {
						const newScopes = new Map(scopes);
						const existingScope = newScopes.get(scopeId);
						newScopes.set(scopeId, {
							...existingScope,
							bracketInfo,
							color: bracketInfo.color,
							depth: bracketInfo.depth,
							isGreyed: bracketInfo.color === DEFAULT_COLOR,
						});

						set({ scopes: newScopes });
						logger.trace(
							`Successfully updated scope ${scopeId} with new color properties`
						);
					} else {
						logger.trace(
							`Skipping color update for scope ${scopeId} - conditions not met`
						);
					}
				},

				findNearestColoredScope: (id) => {
					logger.suffix("findNearestColoredScope");
					const { scopes, lines } = get();

					logger.debug(`Finding nearest colored scope for ID: ${id}`);

					let scopeId;

					if (lines.has(id)) {
						// It's a line ID;
						const lineInfo = lines.get(id);
						if (!lineInfo) {
							logger.warn(
								`Line info not found for line ID ${id}`
							);
							return null;
						}
						scopeId = lineInfo.scopeId;
						logger.trace(
							`ID ${id} is a line ID, resolved to scope ${scopeId}`
						);
					} else {
						// Assume it's a scope ID
						scopeId = id;
						logger.trace(`ID ${id} assumed to be a scope ID`);
					}

					const scope = scopes.get(scopeId);
					if (!scope) {
						logger.warn(`Scope ${scopeId} not found`);
						return null;
					}

					logger.trace(
						`Starting scope ${scopeId} - color: ${scope.color}, isGreyed: ${scope.isGreyed}`
					);

					if (!scope.isGreyed) {
						const result = {
							scopeId,
							color: scope.color,
							depth: scope.depth,
						};
						logger.debug(
							`Found colored scope at current level: ${scopeId} (color: ${scope.color})`
						);
						return result;
					}

					// Traverse up the scope tree
					let currentScopeId = scope?.parentScope?.id;
					while (currentScopeId) {
						const parentScope = scopes.get(currentScopeId);
						if (!parentScope) {
							logger.warn();
							return null;
						}

						if (!parentScope.isGreyed) {
							return {
								scopeId: currentScopeId,
								color: parentScope.color,
								depth: parentScope.depth,
							};
						}

						// Move up to the next parent
						currentScopeId = parentScope.parentScope.id;
					}
				},

				// Check if a line is first in its scope
				// could also pass in scopeId but oh well
				isFirstLine: (lineId) => {
					logger.suffix("isFirstLine");
					const { scopes, lines } = get();
					const lineInfo = lines.get(lineId);
					if (!lineInfo) {
						logger.trace(
							`Line ${lineId} not found when checking if first line`
						);
						return false;
					}

					const scope = scopes.get(lineInfo.scopeId);
					const isFirst = scope && scope.firstLineId === lineId;
					logger.trace(
						`Line ${lineId} is ${
							isFirst ? "" : "not "
						}first line in scope ${lineInfo.scopeId}`
					);
					return isFirst;
				},

				// Check if a line is last in its scope
				// just like isFirstLine, could also pass in scopeId but won't, no particular reason
				isLastLine: (lineId) => {
					logger.suffix("isLastLine");
					const { scopes, lines } = get();
					const lineInfo = lines.get(lineId);
					if (!lineInfo) {
						logger.trace(
							`Line ${lineId} not found when checking if last line`
						);
						return false;
					}

					const scope = scopes.get(lineInfo.scopeId);
					const isLast = scope && scope.lastLineId === lineId;
					logger.trace(
						`Line ${lineId} is ${
							isLast ? "" : "not "
						}last line in scope ${lineInfo.scopeId}`
					);
					return isLast;
				},

				// Get the last line of a line IDs scope
				getLastLine: (lineId) => {
					logger.suffix("geLastLine");
					const { scopes, lines } = get();
					const lineInfo = lines.get(lineId);
					if (!lineInfo) {
						logger.warn(
							`Line ${lineId} not found when getting last line`
						);
						return false;
					}

					const scope = scopes.get(lineInfo.scopeId);
					if (!scope || !scope.lastLineId) {
						logger.warn(
							`No last line found for scope ${lineInfo.scopeId}`
						);
						return false;
					}

					const lastLineInfo = lines.get(scope.lastLineId);
					if (!lastLineInfo) {
						logger.error(
							`Last line ${scope.lastLineId} info not found in lines map`
						);
						return false;
					}

					const lastLineNumber = lastLineInfo.lineNumber;
					logger.trace(
						`Last line number for scope ${lineInfo.scopeId} is ${lastLineNumber}`
					);
					return lastLineNumber;
				},

				getScopeInfo: (scopeId) => {
					logger.suffix("getScopeInfo");
					const { scopes } = get();
					const scopeInfo = scopes.get(scopeId) || null;
					logger.trace(
						`Retrieved scope info for ${scopeId}:`,
						scopeInfo ? "found" : "not found"
					);
					return scopeInfo;
				},

				unregisterScope: (scopeId) => {
					logger.suffix("unregisterScope");
					const { scopes } = get();
					if (!scopes.has(scopeId)) {
						logger.warn(
							`Attempted to unregister non-existent scope ${scopeId}`
						);
						return;
					}

					const scopesWithParent = [...scopes].filter(
						([k, v]) => v.parentScope?.id === scopeId
					);
					const newScopes = new Map(scopes);

					logger.debug(
						`Unregistering scope ${scopeId}, updating ${scopesWithParent.length} child scopes`
					);

					scopesWithParent.forEach(([k, v]) => {
						const s = newScopes.get(k);
						if (!s) return;
						newScopes.set(k, { ...s, parentScope: null });
						logger.trace(
							`Removed parent reference from child scope ${k}`
						);
					});

					newScopes.delete(scopeId);

					set({ scopes: newScopes });
				},

				unregisterLine: (lineId, scopeId) => {
					logger.suffix("unregisterLine");
					const { lines, scopes } = get();
					const lineInfo = lines.get(lineId);
					if (!lineInfo) {
						logger.warn(
							`Attempted to unregister non-existent line ${lineId}`
						);
						return false;
					}

					const newLines = new Map(lines);
					newLines.delete(lineId);

					const actualScopeId = scopeId || lineInfo.scopeId;
					const scope = scopes.get(actualScopeId);
					if (!scope) {
						logger.warn(
							`Scope ${actualScopeId} not found when unregistering line ${lineId}`
						);
						set({ lines: newLines });
						return true;
					}

					const newScopeLines = scope.lines.filter(
						(lineMeta) => lineMeta.id !== lineId
					);
					const updatedScope = {
						...scope,
						lines: newScopeLines,
						firstLineObj:
							newScopeLines.length > 0 ? newScopeLines[0] : null,
						lastLineObj:
							newScopeLines.length > 0
								? newScopeLines[newScopeLines.length - 1]
								: null,
					};

					const newScopes = new Map(scopes);
					newScopes.set(actualScopeId, updatedScope);

					logger.debug(
						`Unregistered line ${lineId} from scope ${actualScopeId}, ${newScopeLines.length} lines remaining`
					);

					set({ lines: newLines, scopes: newScopes });
					return true;
				},

				isScopeContained: (childScopeId, parentScopeId) => {
					logger.suffix("isScopeContained");
					const { scopes } = get();

					let currentId = childScopeId;
					let depth = 0;
					while (currentId && depth < 100) {
						// Prevent infinite loops
						const scope = scopes.get(currentId);
						if (!scope) break;

						if (scope.parentScope.id === parentScopeId) {
							logger.trace(
								`Scope ${childScopeId} is contained in ${parentScopeId} at depth ${depth}`
							);
							return true;
						}

						currentId = scope.parentScope.id;
						depth++;
					}

					if (depth >= 100) {
						logger.error(
							`Potential infinite loop detected while checking scope containment for ${childScopeId}`
						);
					}

					logger.trace(
						`Scope ${childScopeId} is not contained in ${parentScopeId}`
					);
					return false;
				},

				// Actions related to collapsing/expanding scopes

				collapseScope: (scopeId) => {
					logger.suffix("collapseScope");
					const { scopes, collapsedScopes } = get();
					const scope = scopes.get(scopeId);

					if (!scope) {
						logger.warn(
							`Attempted to collapse non-existent scope ${scopeId}`
						);
						return;
					}

					if (collapsedScopes.has(scopeId)) {
						logger.debug(`Scope ${scopeId} is already collapsed`);
						return;
					}

					const newCollapsedScopes = new Set(collapsedScopes);
					newCollapsedScopes.add(scopeId);

					logger.info(`Collapsed scope ${scopeId}`);
					set({ collapsedScopes: newCollapsedScopes });
					return true;
				},

				expandScope: (scopeId) => {
					logger.suffix("expandScope");
					const { collapsedScopes } = get();
					if (!collapsedScopes.has(scopeId)) {
						logger.debug(
							`Scope ${scopeId} is not collapsed, cannot expand`
						);
						return false;
					}

					// Remove from collapsed scopes
					const newCollapsedScopes = new Set(collapsedScopes);
					newCollapsedScopes.delete(scopeId);

					logger.info(`Expanded scope ${scopeId}`);
					set({ collapsedScopes: newCollapsedScopes });
					return true;
				},

				toggleScopeCollapse: (scopeId) => {
					logger.suffix("toggleScopeCollapse");
					const { collapsedScopes } = get();

					if (collapsedScopes.has(scopeId)) {
						logger.debug(`Toggling scope ${scopeId} to expanded`);
						return get().expandScope(scopeId);
					} else {
						logger.debug(`Toggling scope ${scopeId} to collapsed`);
						return get().collapseScope(scopeId);
					}
				},

				isScopeCollapsed: (scopeId) => {
					logger.suffix("isScopeCollapsed");
					const isCollapsed = get().collapsedScopes.has(scopeId);
					logger.trace(
						`Scope ${scopeId} collapse state: ${
							isCollapsed ? "collapsed" : "expanded"
						}`
					);
					return isCollapsed;
				},

				isLineVisible: (lineId) => {
					logger.suffix("isLineVisible");
					const { lines, collapsedScopes, scopes } = get();
					const lineInfo = lines.get(lineId);

					if (!lineInfo) {
						logger.trace(
							`Line ${lineId} info not found, assuming visible`
						);
						return true; // if no info, assume visible
					}

					const scopeId = lineInfo.scopeId;
					const scope = scopes.get(scopeId);

					if (!scope) {
						logger.warn(
							`Scope ${scopeId} not found for line ${lineId}, assuming visible`
						);
						return true;
					}

					// Check if this line's scope is collapsed
					if (collapsedScopes.has(scopeId)) {
						// Only first and last lines are visible in collapsed scope
						const isVisible =
							lineId === scope.firstLineId ||
							lineId === scope.lastLineId;
						logger.trace(
							`Line ${lineId} visibility in collapsed scope ${scopeId}: ${
								isVisible ? "visible" : "hidden"
							}`
						);
						return isVisible;
					}

					// Check if any parent scope is collapsed and this line is hidden
					let currentScopeId = scope.parentScope.id;
					let parentDepth = 0;
					while (currentScopeId && parentDepth < 100) {
						// Prevent infinite loops
						const parentScope = scopes.get(currentScopeId);
						if (!parentScope) break;

						if (collapsedScopes.has(currentScopeId)) {
							// Check if this line is part of the visible first/last lines of parent
							const isFirstLineOfParent =
								parentScope.firstLineId === lineId;
							const isLastLineOfParent =
								parentScope.lastLineId === lineId;

							if (!isFirstLineOfParent && !isLastLineOfParent) {
								logger.trace(
									`Line ${lineId} hidden by collapsed parent scope ${currentScopeId}`
								);
								return false; // Line is hidden by collapsed parent scope
							}
						}

						currentScopeId = parentScope.parentScope.id;
						parentDepth++;
					}

					if (parentDepth >= 100) {
						logger.error(
							`Potential infinite loop detected while checking line visibility for ${lineId}`
						);
					}

					logger.trace(`Line ${lineId} is visible`);
					return true; // Line is visible
				},

				getScopeCollapseInfo: (scopeId) => {
					logger.suffix("getScopeCollapseInfo");
					const { collapsedScopes } = get();
					const isCollapsed = collapsedScopes.has(scopeId);
					logger.trace(
						`Scope ${scopeId} collapse info: ${
							isCollapsed ? "collapsed" : "expanded"
						}`
					);
					return isCollapsed;
				},
			}),
			{
				name: "scope-store",
				serialize: {
					options: true,
				},
			}
		)
	);
};

export default useScopeStore;
