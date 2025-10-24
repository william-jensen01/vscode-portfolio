export const searchSlice = (set, get) => ({
	searchQuery: "",
	searchResults: [],
	setSearchQuery: (query) => set(() => ({ searchQuery: query })),
	setSearchResults: (results) => set(() => ({ searchResults: results })),
	updateSearchState: (query, results) =>
		set(() => ({
			searchQuery: query,
			searchResults: results && Array.isArray(results) ? results : null,
		})),
	searchSettings: (searchTerm, options = {}) => {
		if (!searchTerm) return [];

		const {
			caseSensitive = false,
			includeFields = ["navigation", "description", "options"],
			categoryFilter = null,
			exactMatch = false,
			includeOptions = true,
		} = options;

		const searchTermProcessed = caseSensitive
			? searchTerm
			: searchTerm.toLowerCase();

		const settings = get().getAllSettings({
			sorted: true,
		});

		return settings.filter((setting) => {
			// Apply category filter if provided
			if (categoryFilter && setting.category !== categoryFilter) {
				return false;
			}

			// Check if setting matches the search term in any of the specified field
			return includeFields.some((field) => {
				const fieldValue = setting[field];

				if (fieldValue === undefined || fieldValue === null) {
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
								const optionValueStr = String(option.value);
								const processedValue = caseSensitive
									? optionValueStr
									: optionValueStr.toLowerCase();
								if (
									exactMatch
										? processedValue === searchTermProcessed
										: processedValue.includes(
												searchTermProcessed
										  )
								) {
									return true;
								}
							}

							// Search in option description
							if (option.description) {
								const processedDesc = caseSensitive
									? option.description
									: option.description.toLowerCase();
								if (
									exactMatch
										? processedDesc === searchTermProcessed
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
					let processedValue = caseSensitive
						? valueStr
						: valueStr.toLowerCase();

					if (field === "navigation") {
						const parts = valueStr.split(".");
						const formattedParts = parts.map((part, index) => {
							// Capitalize first letter
							part = part.charAt(0).toUpperCase() + part.slice(1);

							// Convert camelCase to Space Separated Words
							part = part.replace(/([A-Z])/g, " $1").trim();

							if (!caseSensitive) part = part.toLowerCase();

							return part;
						});
						processedValue = formattedParts.join(" ");
					}
					return exactMatch
						? processedValue === searchTermProcessed
						: processedValue.includes(searchTermProcessed);
				}
			});
		});
	},
});

export const persistSearchState = (state, persistedState) => {
	persistedState.searchQuery = state.searchQuery;
	persistedState.searchResults = state.searchResults;
};
