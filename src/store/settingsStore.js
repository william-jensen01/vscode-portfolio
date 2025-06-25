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

				// Special case for theme: set attribute on document
				if (key === "theme") {
					document?.documentElement?.setAttribute(
						"data-theme",
						value.value
					);
				}

				// Do we let value be the index of new option?
				// value: state[key].options[value]

				set((state) => ({
					...state,
					[key]: {
						...state[key],
						value: value,
					},
				}));
			},

			getAllSettings: () => {
				const all = { ...get() };
				Object.keys(all).forEach((key) => {
					if (typeof all[key] !== "object") delete all[key];
				});
				return all;
			},

			groupByHierarchy: () => {
				logger.suffix("groupByHierarchy");
				const addToGroup = (groups, keys, depth, key, obj) => {
					if (depth >= keys.length) {
						return;
					}

					const groupKey = obj[keys[depth]];

					if (!groups[groupKey]) {
						groups[groupKey] = {};
					}

					if (depth === keys.length - 1) {
						groups[groupKey][key] = obj;
					} else {
						addToGroup(groups[groupKey], keys, depth + 1, key, obj);
					}
				};

				// const hierarchyKeys = ["category", "sub_category"];
				const hierarchyKeys = ["category"];
				const result = {};
				const settings = get().getAllSettings();

				Object.entries(settings).forEach(([key, obj]) => {
					addToGroup(result, hierarchyKeys, 0, key, obj);
				});

				return result;
			},
		};
	})
);

export default settingsStore;
