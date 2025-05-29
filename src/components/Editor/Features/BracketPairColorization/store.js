import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

export function isOpeningBracket(char) {
	return ["(", "{", "["].includes(char);
}

function isAngleBracket(character) {
	return character === "<" || character === ">";
}

export function getMatchingBracket(char) {
	const pairs = {
		"(": ")",
		"{": "}",
		"[": "]",
		")": "(",
		"}": "{",
		"]": "[",
		">": "<",
	};
	return pairs[char];
}

export const BracketPairColorizerContext = createContext(null);

const DEFAULT_PROPS = {
	bracketStack: [],
	bracketMap: new Map(),
};

export const createBracketPairColorizerStore = (initProps) => {
	return createStore((set, get) => ({
		...DEFAULT_PROPS,
		...initProps,
		getCurrentDepth: () => {
			return get().bracketStack.length;
		},

		registerBracket: (id, character) => {
			const { bracketStack, bracketMap } = get();
			let depth;
			let newBracketStack = [...bracketStack];
			let isAngle = false;
			const isOpening = isOpeningBracket(character);

			if (isAngleBracket(character)) {
				isAngle = true;
				// For angle brackets, we don't track pairs or nesting
				depth = 0;
			} else {
				if (isOpening) {
					depth = newBracketStack.length;
					newBracketStack.push(character);
				} else {
					const matchingOpening = getMatchingBracket(character);

					const lastOpenIdx = [...newBracketStack]
						.reverse()
						.findIndex((entry) => entry === matchingOpening);

					if (lastOpenIdx === -1) {
						// No matching opening bracket found, treat as depth 0
						depth = 0;
					} else {
						// Use the depth of the matching opening bracket
						depth = newBracketStack.length - lastOpenIdx - 1;

						// Remove all brackets up to and including the matching one
						newBracketStack = newBracketStack.slice(
							0,
							newBracketStack.length - lastOpenIdx - 1
						);
					}
				}
			}

			const newBracketMap = new Map(bracketMap);
			newBracketMap.set(id, { depth, isAngle });

			set({ bracketStack: newBracketStack, bracketMap: newBracketMap });

			return {
				depth,
				// color: depth,
				color: isAngle ? -1 : depth,
				isOpening,
				character,
			};
		},

		getBracketColor: (id) => {
			const { bracketMap } = get();
			const bracketInfo = bracketMap.get(id) || {
				depth: 0,
				isAngle: false,
			};
			const { depth, isAngle } = bracketInfo;

			return {
				depth,
				color: isAngle ? -1 : depth,
			};
		},

		unregisterBracket: (id) => {
			const { bracketStack, bracketMap } = get();

			const newBracketMap = new Map(bracketMap);
			newBracketMap.delete(id);

			const newBracketStack = bracketStack.filter(
				(bracket) => bracket.id !== id
			);

			set({ bracketStack: newBracketStack, bracketMap: newBracketMap });
		},
	}));
};

export const useBracketStore = (selector) => {
	const store = useContext(BracketPairColorizerContext);
	if (!store)
		throw new Error("Missing BracketPairColorizerContext.Provider in the tree");
	return useStore(store, selector);
};
