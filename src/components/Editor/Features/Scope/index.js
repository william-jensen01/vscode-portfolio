import React, { useMemo, useRef, createContext, useContext } from "react";
import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useScopeStore } from "./scopeStore";
import { useBracketStore } from "../BracketPairColorization/store";
import { useDynamicColor } from "../../hooks/useDynamicColor";

const ScopeContext = createContext({
	scopeId: null,
	nearestColoredScope: null,
});
export const useParentScope = () => {
	return useContext(ScopeContext);
};

const Scope = ({ children, ...restProps }) => {
	// Find parent scope
	const { scopeId: parentScopeId } = useParentScope();
	const scopeId = useGeneratedId("scope");

	const scopeRef = useRef(null);
	const registeredRef = useRef(false);

	const isScopeCollapsed = useScopeStore((state) =>
		state.isScopeCollapsed(scopeId)
	);
	const registerScope = useScopeStore((state) => state.registerScope);
	const highlightedScope = useScopeStore((state) => state.highlightedScope);
	const activeScope = useScopeStore((state) => state.activeScope);

	const getCurrentDepth = useBracketStore((state) => state.getCurrentDepth);

	if (!registeredRef.current) {
		registerScope(scopeId, parentScopeId, getCurrentDepth());
		registeredRef.current = true;
	}

	const scopeInfo = useScopeStore((state) => state.getScopeInfo(scopeId));
	const findNearestColoredScope = useScopeStore(
		(state) => state.findNearestColoredScope
	);

	const scopeInfoRef = useRef(null);
	const cachedNearestColoredScopeRef = useRef(null);

	const nearestColoredScope = useMemo(() => {
		if (!scopeInfo) return null;

		// Only recalculate if the color has changed
		if (scopeInfo.color !== scopeInfoRef.current?.color) {
			// If this scope has a real color, it's the nearest
			if (scopeInfo.color !== -1) {
				return scopeInfo;
			}

			// Otherwise, find the nearest parent with a color
			const nearest = findNearestColoredScope(scopeId);
			cachedNearestColoredScopeRef.current = nearest;
			return nearest;
		}

		// Color didn't change, return cached value
		return cachedNearestColoredScopeRef.current;
	}, [scopeInfo, scopeId, findNearestColoredScope]);

	const scopeColor = useMemo(() => {
		if (!scopeInfo) return undefined;

		// If within return context, use nearest scope color + 1
		if (scopeInfo.isWithinReturn) {
			return nearestColoredScope?.color !== undefined
				? nearestColoredScope.color + 1
				: undefined;
		}

		return scopeInfo.color;
	}, [scopeInfo, nearestColoredScope?.color]);

	scopeInfoRef.current = scopeInfo;

	const color = useDynamicColor(scopeColor);

	const isHighlighted = highlightedScope?.scopeId === scopeId;
	const isActive = activeScope?.scopeId === scopeId;

	const scopeContextValue = useMemo(
		() => ({
			scopeId,
			nearestColoredScope,
		}),
		[scopeId, nearestColoredScope]
	);

	return (
		<ScopeContext.Provider value={scopeContextValue}>
			<div
				ref={scopeRef}
				className={`scope ${isScopeCollapsed ? "collapsed" : ""}  ${
					isHighlighted ? "highlighted" : ""
				} ${isActive ? "active" : ""}`}
				style={{ "--scope-color": color }}
				data-scope-id={scopeId}
				data-is-within-return={scopeInfo?.isWithinReturn}
				data-is-greyed={scopeInfo?.isGreyed}
				data-is-highlighted={isHighlighted}
			>
				{children}
			</div>
		</ScopeContext.Provider>
	);
};
export default Scope;
