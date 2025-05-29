import { useRef, useEffect } from "react";
import { create } from "zustand";
import useSettingsStore from "./settingsStore";

const colorStore = create((set, get) => ({
	colors: [],
	isInitialized: false,
	fallbackColor: "",

	initializeColors: () => {
		if (typeof window === "undefined") return;

		const cssColorListVar = "--dynamic-colors";
		const cssFallbackVar = "--default-color";

		// Initialize fallback color
		const fallbackColor = getComputedStyle(document.documentElement)
			.getPropertyValue(cssFallbackVar)
			.trim();

		set({ fallbackColor });

		try {
			// Get the CSS variables from the document root
			const styles = getComputedStyle(document.documentElement);
			const colorList = styles.getPropertyValue(cssColorListVar).trim();

			if (!colorList) {
				set({
					colors: fallbackColor ? [fallbackColor] : [],
					isInitialized: true,
				});
				return;
			}

			// Convert comma-separated string to array and trim whitespace
			const colors = colorList.split(",").map((color) => color.trim());

			// Set the colors in the store
			set({ colors, isInitialized: true });
		} catch (error) {
			console.error("Error initializing dynamic colors:", error);
			set({
				colors: fallbackColor ? [fallbackColor] : [],
				isInitialized: true,
			});
		}
	},

	// Selectors
	getColorByIndex: (index) => {
		const { colors, isInitialized } = get();

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
	},
}));

export default colorStore;

export const useThemeColors = () => {
	const initializeColors = colorStore((state) => state.initializeColors);
	const isInitialized = colorStore((state) => state.isInitialized);
	const colors = colorStore((state) => state.colors);
	const getColorByIndex = colorStore((state) => state.getColorByIndex);

	const { value: theme } = useSettingsStore((state) => state.theme);
	const lastTheme = useRef(theme);

	useEffect(() => {
		if (!isInitialized || theme !== lastTheme.current) {
			initializeColors(theme);
			lastTheme.current = theme;
		}
	}, [isInitialized, initializeColors, theme]);

	return { theme, isInitialized, colors, getColorByIndex };
};
