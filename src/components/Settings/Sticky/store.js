import { createContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import Logger from "../../../util/logger";
import tableOfContentsStore from "../TableOfContents/store";
import { useContext } from "react";
const logger = new Logger("stickyHeaderStore");

export const createStickyHeaderStore = () => {
	return createStore(state);
};

export const StickyContext = createContext(null);
export function StickyHeaderProvider({ children }) {
	const storeRef = useRef();

	if (!storeRef.current) {
		storeRef.current = createStickyHeaderStore();
	}

	return (
		<StickyContext.Provider value={storeRef.current}>
			{children}
		</StickyContext.Provider>
	);
}

export const useStickyStore = (selector) => {
	const store = useContext(StickyContext);
	if (!store) throw new Error("Missing StickyContext.Provider in the tree");
	return useStore(store, selector);
};

export const useStickyStoreInstance = () => {
	const store = useContext(StickyContext);
	if (!store) throw new Error("Missing StickyContext.Provider in the tree");
	return store;
};

const state = (set, get) => ({
	stickyHeaders: new Map(),
	categories: new Map(),
	latestHeading: null,

	setStickyHeaders: (headers) => {
		// Sort headers by key and add id
		const sorted = Array.from(headers.entries())
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([k, v]) => ({ ...v, id: k }));

		const latestHeading =
			sorted.length > 0 ? sorted[sorted.length - 1] : null;
		set({ stickyHeaders: headers, latestHeading });
	},

	registerCategory: (categoryId, categoryData) => {
		logger.suffix("registerCategory");
		logger.debug(`${categoryId}`);

		if (!categoryData.element) {
			logger.trace("skipping registration - no element");
			return;
		}

		const { categories } = get();

		const rect = categoryData.element.getBoundingClientRect();

		logger.log(categoryId, {
			top: rect.top,
			bottom: rect.bottom,
			height: rect.height,
		});

		const newCategories = new Map(categories);
		newCategories.set(categoryId, {
			element: categoryData.element,
			header: null,
			positions: {
				categoryTop: rect.top,
				categoryBottom: rect.bottom,
			},
		});

		set({ categories: newCategories });
	},

	registerHeader: (headerId, headerData) => {
		logger.suffix("registerHeader");
		logger.debug(headerId);
		const { categories } = get();

		const category = categories.get(headerData.categoryId);

		const headerElement = headerData.element;
		if (!headerId || !headerElement) {
			logger.warn(
				"skipping registration - missing data",
				headerId,
				headerElement,
				category
			);
		}

		const rect = headerElement.getBoundingClientRect();

		const newCategories = new Map(categories);
		newCategories.set(headerData.categoryId, {
			...category,
			header: {
				element: headerElement,
				level: headerData.level,
				title: headerData.title,
				positions: {
					top: rect.top,
					bottom: rect.bottom,
					height: rect.height,
				},
			},
		});

		set({ categories: newCategories });

		// Calculate the header's position relative to the list
		// const rect = headerElement.getBoundingClientrect();
		// const offsetTop = rect.top - fileContainerRect.top;
	},

	measureCategory: (categoryId, container) => {
		logger.suffix("measureCategory");
		logger.trace(`${categoryId}`);

		const { categories } = get();
		const category = categories.get(categoryId);
		if (!category || !category.element) return;

		const newCategories = new Map(categories);

		const containerRect = container.getBoundingClientRect();
		const rect = category.element.getBoundingClientRect();
		const offsetTop = rect.top - containerRect.top;
		const offsetBottom = rect.bottom - containerRect.top;

		logger.trace({
			top: offsetTop,
			bottom: offsetBottom,
		});

		newCategories.set(categoryId, {
			...category,
			positions: {
				categoryTop: offsetTop,
				categoryBottom: offsetBottom,
				categoryHeight: offsetBottom - offsetTop,
			},
		});
		set({ categories: newCategories });
	},

	handleScroll: (scrollTop, direction) => {
		logger.suffix("handleSettingScroll");

		logger.trace(`scrollTop: ${scrollTop}, direction: ${direction}`);

		if (scrollTop === undefined) {
			logger.warn("settingsStickyStore :: handleScroll :: no scrollTop");
		}

		const { categories, stickyHeaders, setStickyHeaders } = get();

		const newStickyHeaders = new Map();

		// we need to go in order of ORDER from Table of Contents
		const flattenOrder = tableOfContentsStore.getState().flattened;

		let totalOffset = 0;
		flattenOrder.forEach((category) => {
			const categoryId = category.id;
			const categoryData = categories.get(categoryId);

			if (!categoryData?.header) return;
			// if (!categoryData?.hasOwnProperty("header")) return;

			const effectiveTop =
				categoryData.positions.categoryTop - totalOffset;
			const effectiveBottom =
				direction === 1
					? categoryData.positions.categoryBottom -
					  categoryData.header.positions.height -
					  totalOffset
					: categoryData.positions.categoryBottom -
					  categoryData.header.positions.height -
					  totalOffset;

			const isSticky =
				scrollTop > effectiveTop && scrollTop < effectiveBottom;

			if (isSticky) {
				logger.trace(`${categoryId} is sticky`);

				if (categoryData.header) {
					newStickyHeaders.set(categoryId, {
						...categoryData,
						effectiveTop,
						effectiveBottom,
						totalOffset,
					});
				}

				totalOffset += categoryData.header.positions.height;
			}
		});
		const stickyChanged =
			newStickyHeaders.size !== stickyHeaders.size ||
			[...stickyHeaders.entries()].some(([key, newVal]) => {
				const oldVal = stickyHeaders.get(key);
				return (
					!oldVal ||
					newVal.positions.categoryTop !==
						oldVal.positions.categoryTop
				);
			});
		if (stickyChanged) {
			logger.trace(
				`sticky headers change detected, old: ${stickyHeaders.size} - new: ${newStickyHeaders.size}`
			);
			setStickyHeaders(newStickyHeaders);
		}
	},
});
