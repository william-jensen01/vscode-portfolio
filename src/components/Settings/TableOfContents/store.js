import { create } from "zustand";
import { devtools } from "zustand/middleware";

const collapseSlice = (set, get) => ({
	collapsedStae: {},
	setCollapsedState: (fn) => {
		const prev = get().collapsedState;
		set({ collapsedState: fn(prev) });
	},
	toggleCollapsed: (categoryId) => {
		get().setCollapsedState((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	},
});

const tableOfContentsStore = create(
	devtools(
		(set, get) => ({
			...collapseSlice(set, get),

			flattened: [],
			ordered: [],
			lookupMap: new Map(),

			setState: (toc, hasSearchResults) => {
				// Uncollapse/expand all categories if search results are found
				const allCategories = Array.from(toc.lookupMap.keys());
				get().setCollapsedState(() =>
					allCategories.reduce(
						(acc, category) => ({
							...acc,
							[category]: !hasSearchResults,
						}),
						{}
					)
				);

				set({
					flattened: toc.flattened,
					ordered: toc.ordered,
					lookupMap: toc.lookupMap,
				});
			},
		}),
		{
			store: "settings-table-of-contents",
			serialize: {
				options: true,
			},
		}
	)
);

export default tableOfContentsStore;

export const useTableOfContentsStore = (...args) => {
	return tableOfContentsStore(...args);
};
