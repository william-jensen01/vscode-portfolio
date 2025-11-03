import { memo, useMemo, useRef } from "react";
import useSettingsStore from "../../../../store/settingsStore";
import { useParentScope } from "../../Features/Scope";
import { useLine } from "../Line";
import { useScopeStore } from "../../Features/Scope/scopeStore";
import { useDynamicColor } from "../../hooks/useDynamicColor";
import { useSpacerSelection } from "../../Features/Selection/useSpacerSelection";
import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useFileBoundingRectStore } from "../../../../store/fileBoundingRectStore";

const Spacers = memo(() => {
	const { scopeId } = useParentScope();
	const { lineId } = useLine();

	const fileContainerRect = useFileBoundingRectStore((state) => state.rect);

	const isFirstLineScope = useScopeStore((state) =>
		state.isFirstLine(lineId)
	);
	const isLastLineScope = useScopeStore((state) => state.isLastLine(lineId));
	const scopeInfo = useScopeStore((state) =>
		scopeId ? state.getScopeInfo(scopeId) : null
	);
	const highlightedScope = useScopeStore((state) => state.highlightedScope);
	const activeScope = useScopeStore((state) => state.activeScope);

	const { value: indentationSetting, options: indentationOptions } =
		useSettingsStore((state) => state.indentation);
	const indentationValue = indentationOptions[indentationSetting].value;

	const whitespaceSetting = useSettingsStore(
		(state) => state.renderWhitespace
	);
	const tabSizeSetting = useSettingsStore((state) => state.tabSize);
	const mobileTabSizeSetting = useSettingsStore(
		(state) => state.mobileTabSize
	);

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
					isTab={indentationValue === "tab"}
					isSpace={indentationValue === "spaces"}
					whitespaceSetting={whitespaceSetting}
					tabSizeSetting={tabSizeSetting}
					mobileTabSizeSetting={mobileTabSizeSetting}
					fileContainerRect={fileContainerRect}
				/>
			);
		});
	}, [
		indentations,
		lineId,
		highlightedScope,
		activeScope,
		indentationValue,
		whitespaceSetting,
		tabSizeSetting,
		mobileTabSizeSetting,
		fileContainerRect,
	]);

	return spacerElements;
});

export default Spacers;

export function SpacerTab({
	scopeId,
	colorId,
	isHighlighted,
	isActive,
	isTab,
	isSpace,
	style,
	whitespaceSetting,
	tabSizeSetting,
	mobileTabSizeSetting,
	fileContainerRect,
	...props
}) {
	const isMobile = fileContainerRect.width + fileContainerRect.left < 600;

	const adjustedTabSize = isMobile
		? mobileTabSizeSetting.value
		: tabSizeSetting.value;

	const color = useDynamicColor(colorId);
	const isDynamic = typeof colorId === "number" && colorId >= 0;

	const styles = { ...style };
	if (isDynamic) {
		styles["--_tab-color"] = color;
	}

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
			<span className="guide" />
			{isTab && (
				<Gap
					whitespace="tab"
					whitespaceSetting={whitespaceSetting}
					content={" ".repeat(adjustedTabSize)}
					style={{ width: `${adjustedTabSize}ch` }}
				/>
			)}

			{isSpace &&
				Array.from({ length: adjustedTabSize }).map((_, idx) => (
					<Gap
						key={`space-${idx}`}
						whitespace="space"
						whitespaceSetting={whitespaceSetting}
						content={" "}
					/>
				))}
		</span>
	);
}

export function Gap({
	children,
	whitespace,
	whitespaceSetting,
	content,
	...props
}) {
	const id = useGeneratedId("gap");
	const gapRef = useRef(null);

	const whitespaceSettingValue =
		whitespaceSetting?.options[whitespaceSetting?.value]?.value;

	const { showWhitespace } = useSpacerSelection(
		gapRef,
		whitespaceSettingValue
	);

	const isEnabled = whitespaceSettingValue === "all";
	const isConditional =
		whitespaceSettingValue === "selection" ||
		whitespaceSettingValue === "boundary";

	// prettier-ignore
	const flag = isEnabled || (isConditional && showWhitespace);

	return (
		<span
			ref={gapRef}
			className={`gap ${whitespace}`}
			data-id={id}
			{...props}
		>
			{children || content}
			{flag && <span className="whitespace-marker"></span>}
		</span>
	);
}
