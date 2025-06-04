import { createContext, useContext } from "react";
import { create, createStore, useStore } from "zustand";
import { subscribeWithSelector, devtools } from "zustand/middleware";

import Logger from "../util/logger";
const logger = new Logger("FileBoundingRectStore");

const DEFAULT_PROPS = {
	__ref: null, // file container reference
	rect: null, // current bounding client rect
};

export const FileBoundingRectContext = createContext(null);

export const useFileBoundingRectStore = (selector) => {
	const store = useContext(FileBoundingRectContext);
	if (!store)
		throw new Error("Missing FileBoundingRectContext.Provider in the tree");
	return useStore(store, selector);
};

// Returns the store instance retrieved from context
export const useFileBoundingRectStoreInstance = () => {
	return useContext(FileBoundingRectContext);
};

// Returns the selected state from the store instance passed as an argument
export const useFileBoundingRectFromStore = (store, selector) => {
	return useStore(store, selector);
};

export const createFileBoundingRectStore = (initProps) => {
	console.log(
		"%cCreating FileBoundingRectStore",
		"font-weight: bold;font-size: 1.5rem;"
	);
	return createStore(
		subscribeWithSelector((set, get) => ({
			...DEFAULT_PROPS,
			...initProps,
			// Set the file container reference
			setRef: (ref) => {
				logger.suffix("setRef");

				const { __ref } = get();

				// Avoid unnecessary updates if ref hasn't changed
				if (__ref === ref) {
					logger.info("ref hasn't changed, stopping");
					return;
				}

				set({ __ref: ref });

				if (ref) {
					logger.info("setting bounding rect");
					// Initial measurement
					const rect = ref.getBoundingClientRect();
					set({ rect });
				} else {
					logger.info("ref is null, clearing rect");
					// Clear rect when ref is removed
					set({ rect: null });
				}
			},

			// Update the rect measurement
			updateRect: (r) => {
				logger.suffix("updateRect");
				const { __ref, rect } = get();
				if (!__ref) {
					logger.warn("No reference to file container");
					return;
				}

				if (r) {
					logger.info("clientRect was provided as argument");
					return set({ rect: r });
				}

				logger.info("invoking getBoundingClientRect...");
				return set({ rect: __ref.getBoundingClientRect() });
			},
		}))
	);
};
