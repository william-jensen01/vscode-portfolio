import React, { useMemo, useRef, createContext, useContext } from "react";
import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useScopeStore } from "./scopeStore";
import { useBracketStore } from "../BracketPairColorization/store";

const ScopeContext = createContext({
	scopeId: null,
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
	const getCurrentDepth = useBracketStore((state) => state.getCurrentDepth);

	if (!registeredRef.current) {
		registerScope(scopeId, parentScopeId, getCurrentDepth());
		registeredRef.current = true;
	}

	const scopeContextValue = useMemo(
		() => ({
			scopeId,
		}),
		[scopeId]
	);

	return (
		<ScopeContext.Provider value={scopeContextValue}>
			<div
				ref={scopeRef}
				className={`scope ${isScopeCollapsed ? "collapsed" : ""}`}
				data-scope-id={scopeId}
			>
				{children}
			</div>
		</ScopeContext.Provider>
	);
};
export default Scope;
