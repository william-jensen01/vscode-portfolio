import { useEffect } from "react";
import useSettingsStore from "../../../../store/settingsStore";
import { useSelectStore } from "./selectStore";

export function useWhitespaceSelection(containerRef) {
	const setSelectionRanges = useSelectStore(
		(state) => state.setSelectionRanges
	);
	const setSelectedElements = useSelectStore(
		(state) => state.setSelectedElements
	);
	const resetSelectedElements = useSelectStore(
		(state) => state.resetSelectedElements
	);

	const whitespaceSetting = useSettingsStore(
		(state) => state.renderWhitespace
	);
	const whitespaceSettingValue =
		whitespaceSetting.options[whitespaceSetting.value].value;

	useEffect(() => {
		if (whitespaceSettingValue !== "selection") return;

		// This is a generic implementation that checks gaps for intersection with selection ranges.
		// Ideally we'd create our own "intersection" logic

		const handleSelectionChange = () => {
			const selection = window.getSelection();

			if (!selection.rangeCount || !containerRef.current) {
				setSelectedElements([]);
				setSelectionRanges([]);
				return;
			}

			// Collect all ranges that intersect with container
			const ranges = [];
			for (let i = 0; i < selection.rangeCount; i++) {
				const range = selection.getRangeAt(i);
				if (
					!range.collapsed &&
					(containerRef.current.contains(
						range.commonAncestorContainer
					) ||
						containerRef.current.contains(range.startContainer) ||
						containerRef.current.contains(range.endContainer))
				) {
					ranges.push(range.cloneRange());
				}
			}

			setSelectionRanges(ranges);

			// For experimental use using tree walker

			// const processSelection = (ranges) => {
			// 	if (!ranges.length) return [];

			// 	const selectedIds = new Set();

			// 	// For each range, find all spacer elements within it
			// 	for (const range of ranges) {
			// 		try {
			// 			// Get all nodes in the range
			// 			const walker = document.createTreeWalker(
			// 				range.commonAncestorContainer,
			// 				NodeFilter.SHOW_ELEMENT,
			// 				{
			// 					acceptNode: (node) => {
			// 						if (
			// 							node.classList.contains("gap") &&
			// 							node.dataset?.id
			// 						) {
			// 							// Check if this node is actually in the range
			// 							return range.intersectsNode(node)
			// 								? NodeFilter.FILTER_ACCEPT
			// 								: NodeFilter.FILTER_SKIP;
			// 						}
			// 						return NodeFilter.FILTER_SKIP;
			// 					},
			// 				}
			// 			);

			// 			let node;
			// 			while ((node = walker.nextNode())) {
			// 				selectedIds.add(node.dataset.id);
			// 			}
			// 		} catch (e) {
			// 			// Handle stale ranges gracefully
			// 			continue;
			// 		}
			// 	}

			// 	return Array.from(selectedIds);
			// };

			// const selectedIds = processSelection(ranges);
			// setSelectedElements(selectedIds);
		};

		document.addEventListener("selectionchange", handleSelectionChange);
		return () => {
			document.removeEventListener(
				"selectionchange",
				handleSelectionChange
			);
		};
	}, [
		setSelectionRanges,
		setSelectedElements,
		whitespaceSettingValue,
		resetSelectedElements,
		containerRef,
	]);
}
