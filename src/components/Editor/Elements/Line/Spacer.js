import { memo, useMemo, useState, useEffect } from "react";
import { useParentScope } from "../../Features/Scope";
import { useLine } from "../Line";
import { useScopeStore } from "../../Features/Scope/scopeStore";
import { useDynamicColor } from "../../hooks/useDynamicColor";

const Spacers = memo(() => {
	const { scopeId } = useParentScope();
	const { lineId } = useLine();
	const isFirstLineScope = useScopeStore((state) =>
		state.isFirstLine(lineId)
	);
	const isLastLineScope = useScopeStore((state) => state.isLastLine(lineId));
	const scopeInfo = useScopeStore((state) =>
		scopeId ? state.getScopeInfo(scopeId) : null
	);
	const highlightedScope = useScopeStore((state) => state.highlightedScope);
	const activeScope = useScopeStore((state) => state.activeScope);

	let { color, parentScope = {} } = scopeInfo || {};

	const indentations = useMemo(() => {
		if (!scopeId) return [];

		const parentIndentations = parentScope?.indentations || [];

		let result = [];
		if (parentIndentations.length > 0) {
			if (!isFirstLineScope && !isLastLineScope) {
				// Add parent indentations
				result = [...parentIndentations];

				if (color !== null && color !== undefined) {
					result.push({ scopeId, colorId: color });
				}

				// result = [...parentIndentations, { scopeId: scopeId }];
			} else {
				// Only parent indentations for first/last lines
				result = [...parentIndentations];
			}
		} else if (
			parentIndentations.length === 0 &&
			color !== null &&
			color !== undefined
		) {
			if (!isFirstLineScope && !isLastLineScope) {
				result.push({
					scopeId,
					colorId: color,
				});
			}
		}
		return result;
	}, [parentScope, color, isFirstLineScope, isLastLineScope, scopeId]);

	const spacerElements = useMemo(() => {
		return indentations.map((indent, idx) => {
			return (
				<SpacerTab
					key={`${lineId}.spacer-tab.${idx}`}
					scopeId={indent.scopeId}
					colorId={indent.colorId}
					isHighlighted={highlightedScope?.scopeId === indent.scopeId}
					isActive={activeScope?.scopeId === indent.scopeId}
					index={idx}
				/>
			);
		});
	}, [indentations, lineId, highlightedScope, activeScope]);

	return spacerElements;
});

export default Spacers;

const TAB_SIZE = 4;
const MOBILE_TAB_SIZE = 2;

export function SpacerTab({
	scopeId,
	colorId,
	isHighlighted,
	isActive,
	style,
	...props
}) {
	const [isMobile, setIsMobile] = useState(false);

	const adjustedTabSize = isMobile ? MOBILE_TAB_SIZE : TAB_SIZE;

	const strTab = " ".repeat(adjustedTabSize);

	const color = useDynamicColor(colorId);
	const isDynamic = typeof colorId === "number" && colorId >= 0;

	const styles = { ...style };
	if (isDynamic) {
		styles["--_tab-color"] = color;
	}

	useEffect(() => {
		// 768 is recommended by gpt and claude
		if (window.innerWidth < 600) {
			setIsMobile(true);
		}
	}, []);

	return (
		<span
			className={`spacer-tab ${isDynamic ? "dynamic" : ""} ${
				isHighlighted ? "highlighted" : ""
			} ${isActive ? "active" : ""}`}
			style={styles}
			data-color={color}
			data-color-id={colorId}
			{...props}
		>
			<span
				className="gap tab"
				style={{
					// height: "100%",
					width: `${adjustedTabSize}ch`,
					// whiteSpace: "pre",
					"--spacer-tab-content": '"→"',
				}}
			>
				{strTab}
			</span>
		</span>
	);
}
