import React from "react";

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
	const tag = bracketMap[character];
	if (!tag) {
		throw new Error("Bracket component must have a valid character prop");
	}

	return React.cloneElement(tag, {
		...props,
		className: `${tag.props.className}`,
	});
}
