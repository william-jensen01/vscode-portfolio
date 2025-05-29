import { create } from "zustand";
import Logger from "../util/logger";

const logger = new Logger("settingsStore");

const INIT_VALUE = {
	theme: {
		default: "atom one dark", // index
		value: "atom one dark", // will be set to options[default]
	},
};

const settingsStore = create((set, get) => {
	return {
		...INIT_VALUE,
		changeSpecificSetting: (key, value) => {
			logger.suffix("changeSpecificSetting").log(key, value);
			set((state) => ({
				...state,
				[key]: {
					...state[key],
					value: value,
				},
			}));
		},
	};
});

export default settingsStore;
