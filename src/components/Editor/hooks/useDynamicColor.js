import useColorStore from "../../../store/colorStore";

/**
 * @param {number} index - The index of the color to retrieve
 * @returns {string} The color at the specified index of current theme
 */
export const useDynamicColor = (index) => {
	const colors = useColorStore((state) => state.colors);
	const isInitialized = useColorStore((state) => state.isInitialized);

	const indexIsProvided = typeof index === "number";
	const indexIsValid = indexIsProvided && index >= 0;
	if (!indexIsValid) return;

	// If store is not initialized yet, return from fallback
	if (!isInitialized || colors.length === 0) {
		return;
		// return fallbackColors[index % fallbackColors.length];
	}

	// Use modulo to handle index out of bounds
	const normalizedIndex =
		((index % colors.length) + colors.length) % colors.length;

	// Return the color at the specified index
	return colors[normalizedIndex];
};
