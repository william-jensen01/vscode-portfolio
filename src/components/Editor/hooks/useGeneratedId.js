import { useState } from "react";

/**
 * Hook that generates a unique ID with an optional prefix
 * @param {string} prefix - Optional prefix for the generated ID
 * @returns {string} A unique ID string
 */
export function useGeneratedId(prefix = "") {
	const [id] = useState(
		() => `${prefix}-${Math.random().toString(36).substring(2, 9)}`
	);
	return id;
}
