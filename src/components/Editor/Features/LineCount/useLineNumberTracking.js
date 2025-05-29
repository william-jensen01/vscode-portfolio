import { useEffect, useRef, useState, useMemo } from "react";
import { useLineStore } from "./lineStore";

/**
 * Custom hook to handle line number tracking and event listening
 *
 * @param {string} scopeId - The ID of the scope
 * @param {string} lineId - The ID of the line
 * @param {React.RefObject} lineRef - Ref object for the line DOM element
 * @returns {Object} - Object containing lineNumber state and lineNumberRef
 */
export const useLineNumberTracking = (scopeId, lineId, lineRef) => {
	const registerLine = useLineStore((state) => state.registerLine);
	const unregisterLine = useLineStore((state) => state.unregisterLine);
	const attachElement = useLineStore((state) => state.attachElement);

	const [lineNumber, setLineNumber] = useState(() =>
		registerLine(scopeId, lineId)
	);

	const lineNumberRef = useRef(lineNumber);
	lineNumberRef.current = lineNumber;
	const hasIncremented = useRef(false);

	// Sync lineNumberRef with lineNumber state
	useEffect(() => {
		lineNumberRef.current = lineNumber;
	}, [lineNumber]);

	// Attach element to store
	useEffect(() => {
		if (!lineRef.current) return;

		if (!hasIncremented.current) {
			attachElement(lineId, lineRef);
			hasIncremented.current = true;
		}

		return () => {
			if (hasIncremented.current) {
				unregisterLine(lineId);
			}
		};
	}, [attachElement, lineId, lineRef, unregisterLine]);

	// Pt. 2 - Listen for changes
	// If a line is removed it will send a "line-number-update" event to the subsequent lines with updated numbering
	useEffect(() => {
		const element = lineRef.current;
		if (!element) return;

		const handleLineUpdate = (e) => {
			const { lineId: updatedLineId, newNumber } = e.detail;
			if (updatedLineId === lineId) {
				setLineNumber(newNumber);
			}
		};

		element.addEventListener("line-number-update", handleLineUpdate);

		return () => {
			if (element) {
				element.removeEventListener(
					"line-number-update",
					handleLineUpdate
				);
			}
		};
	}, [lineId, lineRef, scopeId]);

	const value = useMemo(
		() => ({
			lineNumber,
			lineNumberRef,
			setLineNumber,
		}),
		[lineNumber, lineNumberRef, setLineNumber]
	);

	return value;
};
