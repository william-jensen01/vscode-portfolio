import { create } from "zustand";

export const useSelectStore = create((set, get) => ({
	selectionRanges: [],
	selectedElementIds: new Set(),

	setSelectionRanges: (ranges) => set({ selectionRanges: ranges }),
	setSelectedElements: (elementIds) =>
		set({ selectedElementIds: new Set(elementIds) }),

	isElementSelected: (element, exp = false) => {
		const { selectionRanges, selectedElementIds } = get();
		if (!selectionRanges.length || !element) return false;

		// Check if element is selected from set curated from tree walker
		if (exp) {
			return selectedElementIds.has(element.dataset.id);
		}

		// Check if element intersects with any range
		return selectionRanges.some((range) => range.intersectsNode(element));
	},

	shouldShowWhitespace: (element, settingValue, exp = false) => {
		if (!element || !settingValue) {
			return false;
		}

		const { isElementSelected } = get();

		let flag;
		switch (settingValue) {
			case "none":
				flag = false;
				break;
			case "boundary":
				// Only show whitespace for spacer tabs since they are visual hierarchy and boundary
				flag = !!element.closest(".spacer-tab");
				break;
			case "selection":
				flag = isElementSelected(element, exp);
				break;
			case "all":
				flag = true;
				break;
			default:
				flag = false;
				break;
		}

		return flag;
	},
}));
