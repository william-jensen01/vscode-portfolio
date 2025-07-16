import { useEffect, useState } from "react";
import { useSelectStore } from "./selectStore";

export const useSpacerSelection = (spacerRef, whitespaceSettingValue) => {
	const shouldShowWhitespace = useSelectStore(
		(state) => state.shouldShowWhitespace
	);
	const shouldShowWhitespaceWalker = useSelectStore(
		(state) => state.shouldShowWhitespaceWalker
	);

	// Force re-check when selection changes
	const selectionRanges = useSelectStore((state) => state.selectionRanges);
	const selectedElementIds = useSelectStore(
		(state) => state.selectedElementIds
	);

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (spacerRef.current) {
			const updatedShow = shouldShowWhitespace(
				spacerRef.current,
				whitespaceSettingValue
			);
			setIsVisible(updatedShow);
		}
	}, [
		selectionRanges,
		shouldShowWhitespace,
		whitespaceSettingValue,
		selectedElementIds,
		shouldShowWhitespaceWalker,
		spacerRef,
	]);

	return { showWhitespace: isVisible, whitespaceSettingValue };
};
