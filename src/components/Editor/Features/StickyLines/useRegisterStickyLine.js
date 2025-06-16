import { useEffect, useRef, useState } from "react";
import { useStickyLineStore } from "./stickyStore";
import { useStickySection } from "./Section";

/**
 * Custom hook to handle registering the line with the sticky manager
 *
 * @param {string} lineId - The ID of the line
 * @param {DOM.Element} lineRef - Ref object for the line DOM element
 * @param {number} lineNumber - The line number
 */
export function useRegisterStickyLine(lineId, lineRef, lineNumber) {
	const { sectionId, sectionRegistered } = useStickySection();
	const systemInitialized = useStickyLineStore(
		(state) => state.systemInitialized
	);
	const signalRegistrationIntent = useStickyLineStore(
		(state) => state.signalRegistrationIntent
	);
	const completeRegistrationIntent = useStickyLineStore(
		(state) => state.completeRegistrationIntent
	);
	const [signaled, setSignaled] = useState(false);
	const signaledRef = useRef(false);

	// We are using a three phase registration process:
	// 1. Signal intent to register - this will add each line to a map allowing for total line count to be determined
	// 2. Complete intent - this will decrease the total line count, needed for determining when all lines have completed
	// 3. Finalize (not here, located in Section.js) - when line count is zero, register the first/last lines

	// First we signal our intent to register with the sticky section
	useEffect(() => {
		if (!sectionRegistered || signaledRef.current || !systemInitialized) {
			return;
		}

		signaledRef.current = signalRegistrationIntent(sectionId, {
			lineId,
			lineRef,
			lineNumber,
		});

		setSignaled(true);
	}, [
		systemInitialized,
		sectionRegistered,
		sectionId,
		signalRegistrationIntent,
		lineId,
		lineRef.current,
		lineNumber,
	]);

	// Second, we complete the registration
	useEffect(() => {
		if (!sectionRegistered || !signaled || !systemInitialized) {
			return;
		}

		completeRegistrationIntent(sectionId, lineId);
	}, [
		sectionRegistered,
		systemInitialized,
		signaled,
		completeRegistrationIntent,
		sectionId,
		lineId,
	]);

	return;
}
