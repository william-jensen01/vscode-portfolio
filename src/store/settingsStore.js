import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Logger from "../util/logger";

const logger = new Logger("settingsStore");

const INIT_VALUE = {
	theme: {
		default: 0,
		value: null, // will be set to options[default]
		options: [
			{
				value: "atom one dark",
				description: null,
			},
			{
				value: "darkplus",
				description: null,
			},
			{
				value: "dracula",
				description: null,
			},
		],
		input: "select",
		description: "Specifies the color theme used in the workbench",
		navigation: "workbench.colorTheme",
		category: "workbench",
		sub_category: "appearance",
		capitalize: true,
	},
};

const settingsStore = create(
	devtools((set, get) => {
		Object.values(INIT_VALUE).forEach((setting) => {
			if (setting?.options && setting.value === null) {
				setting.value = setting.options[setting.default];
			}
		});

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
	})
);

export default settingsStore;
