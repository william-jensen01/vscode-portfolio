import { createContext, useContext, useEffect } from "react";
import { createStore, useStore } from "zustand";

import Logger from "../../../../util/logger.js";
const logger = new Logger("LineStore");

const DEFAULT_PROPS = {
	lines: new Map(),
	count: 0,
};

export const LineCountContext = createContext(null);

export const useLineStore = (selector) => {
	const store = useContext(LineCountContext);
	if (!store) {
		logger.error("Missing LineCountContext.Provider in the tree");
		throw new Error("Missing LineCountContext.Provider in the tree");
	}
	return useStore(store, selector);
};

export const createLineStore = (initProps) => {
	logger.info("Creating line store");
	return createStore(
		(set, get) => ({
			...DEFAULT_PROPS,
			...initProps,

			reset: () => {
				logger.info("Resetting line store");
				set({ lines: new Map(), count: 0 });
			},

			registerLine: (scopeId, lineId, index) => {
				logger.suffix("registerLine");
				const state = get();
				if (state.lines.has(lineId)) {
					logger.debug(
						`Line ${lineId} already registered, returning existing line number:`,
						state.lines.get(lineId).number
					);
					return state.lines.get(lineId);
				}

				const newLines = new Map(state.lines);
				const newCount = state.incrementLineCount();
				const lineMeta = {
					lineId,
					number: newCount,
					ref: null,
					scopeId,
				};
				newLines.set(lineId, lineMeta);

				logger.debug(
					`Registered new line ${lineId} with number ${newCount} in scope ${scopeId}`
				);
				set({ lines: newLines });

				return newCount;
			},

			attachElement: (lineId, ref) => {
				logger.suffix("attachElement");
				const { lines } = get();
				// If line doesn't exist, do nothing
				if (!lines.has(lineId)) {
					logger.warn(
						`Attempted to attach element to non-existent line: ${lineId}`
					);
					return;
				}

				const lineInfo = lines.get(lineId);
				const newLines = new Map(lines);
				newLines.set(lineId, { ...lineInfo, ref });

				logger.debug(
					`Attached element reference to line ${lineId} (#${lineInfo.number})`
				);
				set({ lines: newLines });
			},

			// unregister a line and renumber subsequent lines
			unregisterLine: (lineId) => {
				logger.suffix("unregisterLine");
				const { lines, count } = get();
				if (!lines.has(lineId)) {
					logger.warn(
						`Attempted to unregister non-existent line: ${lineId}`
					);
					return;
				}

				const newLines = new Map(lines);
				const { number: lineCount } = newLines.get(lineId);
				const newCount = count - 1;

				logger.debug(
					`Unregistering line ${lineId} (number ${lineCount}), new total count: ${newCount}`
				);
				newLines.delete(lineId);

				// Reduce the line number of all subsequent lines by 1 - relative to the deleted line
				let renumberedCount = 0;
				for (const [currentLineId, lineMeta] of lines) {
					const { number: lineNumber } = lineMeta;
					if (lineNumber > lineCount) {
						const newNumber = lineNumber - 1;
						newLines.set(currentLineId, {
							...lineMeta,
							number: newNumber,
						});

						const updatedEvent = new CustomEvent(
							"line-number-update",
							{
								detail: {
									lineId: currentLineId,
									newNumber,
								},
							}
						);
						lineMeta?.ref?.current?.dispatchEvent(updatedEvent);
						renumberedCount++;
					}
				}

				if (renumberedCount > 0) {
					logger.debug(
						`Renumbered ${renumberedCount} lines after removing line ${lineId}`
					);
				}

				set({ lines: newLines, count: newCount });
			},

			incrementLineCount: (lineId) => {
				logger.suffix("incrementLineCount");
				const newCount = get().count + 1;
				logger.trace(`Incrementing line count to ${newCount}`);
				set({ count: newCount });
				return newCount;
			},

			decrementLineCount: (lineId) => {
				logger.suffix("decrementLineCount");
				const { count } = get();
				const newCount = count - 1;
				logger.trace(
					`Decrementing line count from ${count} to ${newCount}`
				);
				set({ count: newCount });
				return newCount;
			},
		}),
		{ name: "line-store", serialize: { options: true } }
	);
};

// Adjusts the size of line number bar (left of editor) based on line count
export const useUpdateLineWidth = (store) => {
	logger.suffix("useUpdateLineWidth");
	const count = useStore(store, (s) => s.count);

	// Take the digits in count and set css variable
	useEffect(() => {
		if (count > 0) {
			const digitCount = count.toString().length;
			logger.debug(
				`Updating line number width for ${count} lines (${digitCount} digits)`
			);
			try {
				document.documentElement.style.setProperty(
					"--line-number-digit-count",
					`${digitCount}ch`
				);
			} catch (e) {
				logger.error("Failed to update line number width:", e);
			}
		}
	}, [count]);

	return count;
};
