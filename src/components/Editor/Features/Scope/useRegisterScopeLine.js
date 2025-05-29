import { useEffect, useRef } from "react";
import { useScopeStore } from "./scopeStore";

/**
 * Custom hook to register and unregister a line with a scope
 * Registers the line only once and unregisters on unmount
 *
 * @param {string} scopeId - The ID of the scope to register with
 * @param {string} lineId - The ID of the line to register
 * @param {number} lineNumber - The line number
 * @returns {React.RefObject} - A ref containing the line info
 */
export const useRegisterScopeLine = (scopeId, lineId, lineNumber) => {
	const lineInfoRef = useRef(null);
	const registeredRef = useRef(false);
	const previousLineNumberRef = useRef(null);
	const registerScopeLine = useScopeStore((state) => state.registerLine);
	const unregisterLine = useScopeStore((state) => state.unregisterLine);

	if (!registeredRef.current) {
		const lineInfo = registerScopeLine(scopeId, lineId, lineNumber);

		lineInfoRef.current = lineInfo;
		registeredRef.current = true;
		previousLineNumberRef.current = lineNumber;
	}

	useEffect(() => {
		if (previousLineNumberRef.current === lineNumber) return;
		// Only reregister when the line number has changed
		registerScopeLine(scopeId, lineId, lineNumber);
	}, [scopeId, lineId, lineNumber, registerScopeLine]);

	useEffect(() => {
		// Return cleanup function to unregister the line when component unmounts
		return () => {
			if (registeredRef.current) {
				unregisterLine(lineId, scopeId);
				registeredRef.current = false;
			}
		};
	}, [scopeId, lineId, lineNumber, unregisterLine]);

	return { isFirstLine: lineInfoRef.current };
};
