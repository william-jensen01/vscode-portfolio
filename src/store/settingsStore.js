import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useState, useEffect } from "react";
import { allEditorSettings } from "../components/Editor/settings";
import Logger from "../util/logger";
const logger = new Logger("settingsStore");

const allSettingsArray = [
	{
		key: "theme",
		version: 1,
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
		migrations: {
			/* 
			 Example migration:
			 
			 version #: (oldSetting) => {
				// Make whatever changes are needed to migrate to new version
				return {
					...oldSetting,
					version: #,
				}
			 }
			*/
		},
	},
	...allEditorSettings,
];

const INIT_VALUE = allSettingsArray.reduce((acc, setting) => {
	const { migrations, ...settingWithoutMigrations } = setting;
	return {
		...acc,
		[setting.key]: settingWithoutMigrations,
	};
}, {});

// Helper function to initialize settings with defaults
const initializeSettings = (settings) => {
	const initialized = {};

	Object.entries(settings).forEach(([key, setting]) => {
		initialized[key] = {
			...setting,
			value:
				setting.value !== null && setting.value !== undefined
					? setting.value
					: setting.default,
		};
	});

	return initialized;
};

const migrateSetting = (
	settingKey,
	oldSetting,
	targetVersion,
	allMigrations
) => {
	logger.suffix("migrateSetting");
	const oldVersion = oldSetting.version || 1;

	if (oldVersion >= targetVersion) {
		return oldSetting; // No migration needed
	}

	let migratedSetting = oldSetting;
	const settingMigrations = allMigrations[settingKey] || {};

	// Apply migrations sequentially
	for (let version = oldVersion + 1; version <= targetVersion; version++) {
		if (settingMigrations[version]) {
			logger.log(`Migrating ${settingKey} to v${version}`);
			migratedSetting = settingMigrations[version](migratedSetting);
		}
	}

	// Ensure version is updated
	migratedSetting.version = targetVersion;
	return migratedSetting;
};

/**
 * Extract migration functions from setting definitions
 */
const extractMigrations = (settingsArray) => {
	const migrations = {};

	settingsArray.forEach((setting) => {
		if (setting.migrations) {
			migrations[setting.key] = setting.migrations;
		}
	});

	return migrations;
};

/**
 * Extract current versions from setting definitions
 */
const extractVersions = (settingsArray) => {
	const versions = {};

	settingsArray.forEach((setting) => {
		versions[setting.key] = setting.version || 1;
	});

	return versions;
};

// Check and migrate all settings on rehydrate
const checkAndMigrateSettings = (persistedState, allSettings) => {
	logger.suffix("checkAndMigrateSettings");
	const allMigrations = extractMigrations(allSettings);
	const currentVersions = extractVersions(allSettings);

	const migratedState = { ...persistedState };
	let hadMigrations = false;

	Object.entries(currentVersions).forEach(([settingKey, targetVersion]) => {
		if (migratedState[settingKey]) {
			const oldVersion = migratedState[settingKey].version || 1;
			logger.log(`Checking ${settingKey} v${oldVersion}`);

			if (oldVersion < targetVersion) {
				logger.log(`${settingKey}: v${oldVersion} → v${targetVersion}`);
				migratedState[settingKey] = migrateSetting(
					settingKey,
					migratedState[settingKey],
					targetVersion,
					allMigrations
				);
				hadMigrations = true;
			}
		} else {
			// Setting doesn't exist - initialize with current version
			const settingDef = allSettings.find((s) => s.key === settingKey);
			if (settingDef) {
				const { migrations, ...cleanSetting } = settingDef;
				migratedState[settingKey] = { ...cleanSetting };
				hadMigrations = true;
			}
		}
	});

	if (hadMigrations) {
		logger
			.suffix("checkAndMigrateSettings")
			.log("Settings migration completed");
	}
	return migratedState;
};

const settingsStore = create(
	devtools(
		persist(
			(set, get) => {
				return {
					...initializeSettings(INIT_VALUE),
					changeSpecificSetting: (key, valueIndex) => {
						logger
							.suffix("changeSpecificSetting")
							.log(key, valueIndex);

						// Special case for theme: set attribute on document
						if (key === "theme") {
							const state = get();
							const actualOption = state[key].options[valueIndex];
							document?.documentElement?.setAttribute(
								"data-theme",
								actualOption.value
							);
						}

						// Do we let value be the index of new option?
						// value: state[key].options[value]

						set((state) => ({
							...state,
							[key]: {
								...state[key],
								value: valueIndex,
							},
						}));
					},

					getAllSettings: (options = {}) => {
						const { format = "object", sorted = false } = options;

						const all = { ...get() };

						const filteredSettings = Object.fromEntries(
							Object.entries(all).filter(
								([_, value]) => typeof value === "object"
							)
						);

						if (format === "array" || sorted) {
							const test = Object.entries(filteredSettings).map(
								([key, value]) => value
							);
							const sortedSettings = test.sort((a, b) => {
								return a.navigation.localeCompare(b.navigation);
							});
							return sortedSettings;
						}

						return filteredSettings;
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
								addToGroup(
									groups[groupKey],
									keys,
									depth + 1,
									key,
									obj
								);
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

					// Create an object containing all valid settings as data-attributes
					createAttributes: () => {
						console.log("creat attributes");
						const state = get();

						const attributes = {};
						const settings = get().getAllSettings();

						Object.keys(settings).forEach((key) => {
							// Skip the theme as it's applied to the document root
							if (key === "theme") return;

							const item = state[key];

							/*
							 * Setting the data attribute value

							 * 1. Value is an index: get the actual value from options
							 * 2. Value is an integer or boolean: use the value directly 
							 */
							attributes[`data-${item["data_attribute"]}`] =
								item.hasOwnProperty("options") &&
								item.options.length > 0
									? item.options[item.value].value
									: state[key].value;
						});

						return attributes;
					},
					searchSettings: (searchTerm, options = {}) => {
						if (!searchTerm) return [];

						const {
							caseSensitive = false,
							includeFields = [
								"navigation",
								"description",
								"options",
							],
							categoryFilter = null,
							exactMatch = false,
							includeOptions = true,
						} = options;

						const searchTermProcessed = caseSensitive
							? searchTerm
							: searchTerm.toLowerCase();

						// const settings = get().getAllSettings();
						const settings = get().getAllSettings({
							sorted: true,
						});

						// return Object.entries(settings).filter(
						// ([key, setting]) => {

						return settings.filter((setting) => {
							// Apply category filter if provided
							if (
								categoryFilter &&
								setting.category !== categoryFilter
							) {
								return false;
							}

							// Check if setting matches the search term in any of the specified field
							return includeFields.some((field) => {
								const fieldValue = setting[field];

								if (
									fieldValue === undefined ||
									fieldValue === null
								) {
									return false;
								}

								// Handle different types of field values
								if (typeof fieldValue === "object") {
									// Search through option values
									if (
										includeOptions &&
										field === "options" &&
										Array.isArray(fieldValue)
									) {
										return fieldValue.some((option) => {
											// Search in option value
											if (option.value !== undefined) {
												const optionValueStr = String(
													option.value
												);
												const processedValue =
													caseSensitive
														? optionValueStr
														: optionValueStr.toLowerCase();
												if (
													exactMatch
														? processedValue ===
														  searchTermProcessed
														: processedValue.includes(
																searchTermProcessed
														  )
												) {
													return true;
												}
											}

											// Search in option description
											if (option.description) {
												const processedDesc =
													caseSensitive
														? option.description
														: option.description.toLowerCase();
												if (
													exactMatch
														? processedDesc ===
														  searchTermProcessed
														: processedDesc.includes(
																searchTermProcessed
														  )
												) {
													return true;
												}
											}

											return false;
										});
									}

									return false;
								} else {
									// For primitive values
									const valueStr = String(fieldValue);
									const processedValue = caseSensitive
										? valueStr
										: valueStr.toLowerCase();
									return exactMatch
										? processedValue === searchTermProcessed
										: processedValue.includes(
												searchTermProcessed
										  );
								}
							});
						});
					},
				};
			},
			{
				name: "settings-storage",
				partialize: (state) => {
					const persistedState = {};
					Object.keys(state).forEach((key) => {
						if (
							typeof state[key] === "object" &&
							state[key] !== null &&
							typeof state[key] !== "function"
						) {
							persistedState[key] = state[key];
						}
					});
					console.log("persistedState", persistedState);
					return persistedState;
				},
				onRehydrateStorage: () => (state) => {
					logger.suffix("onRehydrateStorage");
					if (!state) return;

					// Check and migrate individual settings
					const migratedState = checkAndMigrateSettings(
						state,
						allSettingsArray
					);

					logger.log("migratedState", migratedState);

					// Replace state with migrated version if changes occurred
					if (migratedState !== state) {
						Object.keys(state).forEach((key) => delete state[key]);
						Object.assign(state, migratedState);
					}

					// if (state?.theme?.value?.value) {
					if (state?.theme && typeof state.theme.value === "number") {
						const themeOption =
							state.theme.options[state.theme.value];
						if (themeOption) {
							document?.documentElement?.setAttribute(
								"data-theme",
								themeOption.value
							);
						}
					}
				},
			}
		)
	)
);

export default settingsStore;

export const useSettingsAttributes = () => {
	const [attributes, setAttributes] = useState({});
	const settings = settingsStore();

	useEffect(() => {
		setAttributes(settings.createAttributes());
	}, [settings]);

	return attributes;
};
