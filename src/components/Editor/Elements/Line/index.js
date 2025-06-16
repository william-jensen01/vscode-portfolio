import { useMemo, useRef, createContext, useContext, useCallback } from "react";
import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useParentScope } from "../../Features/Scope";
import { useScopeStore } from "../../Features/Scope/scopeStore";
import { useRegisterScopeLine } from "../../Features/Scope/useRegisterScopeLine";
import { useLineNumberTracking } from "../../Features/LineCount/useLineNumberTracking";
import { useRegisterStickyLine } from "../../Features/StickyLines/useRegisterStickyLine";
import Spacers from "./Spacer";

const LineContext = createContext({
	lineId: null,
	lineNumber: null,
});
export const useLine = () => {
	return useContext(LineContext);
};

export default function NewLine({ children, className = "", style, ...props }) {
	const lineId = useGeneratedId("line");

	const { scopeId, nearestColoredScope } = useParentScope();

	const lineRef = useRef(null);

	const { lineNumber } = useLineNumberTracking(scopeId, lineId, lineRef);

	useRegisterScopeLine(scopeId, lineId, lineNumber, null);

	useRegisterStickyLine(lineId, lineRef, lineNumber);

	// Placing these here after registration for accuracy and
	const isVisible = useScopeStore((state) => state.isLineVisible(lineId));
	const isScopeCollapsed = useScopeStore((state) =>
		state.isScopeCollapsed(scopeId)
	);
	const toggleScopeCollapse = useScopeStore(
		(state) => state.toggleScopeCollapse
	);

	const isFirstLineScope = useScopeStore((state) =>
		state.isFirstLine(lineId)
	);
	const isLastLineScope = useScopeStore((state) => state.isLastLine(lineId));
	const setHighlightedScope = useScopeStore(
		(state) => state.setHighlightedScope
	);
	const setActiveScope = useScopeStore((state) => state.setActiveScope);

	// Handle mouse enter/leave events for highlighting scope

	const handleMouseEnter = useCallback(() => {
		setHighlightedScope(nearestColoredScope);
		setActiveScope(scopeId);
	}, [scopeId, nearestColoredScope, setHighlightedScope, setActiveScope]);

	const handleMouseLeave = useCallback(() => {
		setHighlightedScope(null);
		setActiveScope(null);
	}, [setHighlightedScope, setActiveScope]);

	// Create line context value to pass down to children
	const lineContextValue = useMemo(
		() => ({
			lineId,
			lineNumber,
			isFirstLineScope,
			isLastLineScope,
		}),
		[lineId, lineNumber, isFirstLineScope, isLastLineScope]
	);

	// Determine if should show collapse indicator
	const showCollapseIndicator = isFirstLineScope;

	return (
		<LineContext.Provider value={lineContextValue}>
			<div
				ref={lineRef}
				className={`line ${
					isFirstLineScope ? "first" : isLastLineScope ? "last" : ""
				} ${isVisible ? "visible" : "invisible"}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				data-scope-id={scopeId}
				data-scope-delimiter={isFirstLineScope || isLastLineScope}
				data-is-first-line-scope={isFirstLineScope}
				data-is-last-line-scope={isLastLineScope}
				data-line-number={lineNumber}
				data-id={lineId}
				{...props}
			>
				<div className="view-number">
					<div className="line-numbers">{lineNumber}</div>

					{showCollapseIndicator && (
						<button
							className={`expand ${
								isScopeCollapsed ? "collapse" : ""
							}`}
							title="Click to expand the range"
							onClick={(e) => {
								toggleScopeCollapse(scopeId);
							}}
						>
							{/* {showCollapseIndicator && "╲╱"} */}
						</button>
					)}
				</div>
				<div className={`view-line ${className}`}>
					<Spacers lineId={lineId} />
					<span>
						{children}

						{isScopeCollapsed && isFirstLineScope && (
							<span
								className="inline-folded"
								onClick={() => toggleScopeCollapse(scopeId)}
							/>
						)}
					</span>
				</div>
			</div>
		</LineContext.Provider>
	);
}
