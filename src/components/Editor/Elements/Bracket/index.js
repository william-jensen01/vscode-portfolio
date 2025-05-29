import React, { useRef, useEffect } from "react";

import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useBracketStore } from "../../Features/BracketPairColorization/store";
import { useDynamicColor } from "../../hooks/useDynamicColor";

const bracketMap = {
	"(": (
		<span className="bracket parenthesis" data-symbol="(">
			&#40;
		</span>
	),
	")": (
		<span className="bracket parenthesis" data-symbol=")">
			&#41;
		</span>
	),
	"{": (
		<span className="bracket brace" data-symbol="{">
			&#123;
		</span>
	),
	"}": (
		<span className="bracket brace" data-symbol="}">
			&#125;
		</span>
	),
	"[": (
		<span className="bracket" data-symbol="[">
			&#91;
		</span>
	),
	"]": (
		<span className="bracket" data-symbol="]">
			&#93;
		</span>
	),
	"<": (
		<span className="bracket angle" data-symbol="<">
			&#60;
		</span>
	),
	">": (
		<span className="bracket angle" data-symbol=">">
			&#62;
		</span>
	),
};

export default function Bracket({
	character,
	isClosingTag,
	editorClass,
	...props
}) {
	const bracketId = useGeneratedId("bracket");

	const registerBracket = useBracketStore((state) => state.registerBracket);
	const unregisterBracket = useBracketStore((state) => state.unregisterBracket);

	const registeredRef = useRef(false);
	const bracketInfoRef = useRef();

	if (!registeredRef.current && !bracketInfoRef.current) {
		const bracketInfo = registerBracket(bracketId, character);
		bracketInfoRef.current = bracketInfo;

		registeredRef.current = true;
	}

	useEffect(() => {
		return () => {
			unregisterBracket(bracketId);
		};
	}, [bracketId, unregisterBracket]);

	const colorIdx = bracketInfoRef.current?.color;

	const color = useDynamicColor(colorIdx);

	const isDynamicColored = typeof colorIdx === "number" && colorIdx >= 0;

	const dynamicClass = isDynamicColored ? "dynamic-color" : "";
	// const dynamicClass = "test-color";

	const tag = bracketMap[character];

	return React.cloneElement(tag, {
		...props,
		className: `${tag.props.className} ${dynamicClass}`,
		style: {
			"--dynamic-color": color,
		},
		"data-color": color,
		"data-color-idx": colorIdx,
		"data-id": bracketId,
	});
}
