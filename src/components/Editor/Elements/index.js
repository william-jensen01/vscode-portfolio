import React from "react";
import { Gap } from "./Line/Spacer";
import useSettingsStore from "../../../store/settingsStore";

export function renderWithSpaces(text) {
	const parts = text.split(" ");
	return parts.map((part, idx) => (
		<React.Fragment key={`part${idx}`}>
			{part}
			{idx < parts.length - 1 && <Space />}
		</React.Fragment>
	));
}

// MARK: Quotation

// "content"
export function Quotation({ children, content }) {
	return children ? (
		React.Children.map(children, (child) => (
			<span className="quotation">"{renderWithSpaces(child)}"</span>
		))
	) : content ? (
		<span className="quotation">"{renderWithSpaces(content)}"</span>
	) : (
		new Error("No children or content provided.")
	);
}

// MARK: Space

export function Space() {
	const whitespaceSetting = useSettingsStore(
		(state) => state.renderWhitespace
	);

	return (
		<Gap whitespace="space" whitespaceSetting={whitespaceSetting}>
			&nbsp;
		</Gap>
	);
}

// MARK: SemiColon

// ;
export function SemiColon() {
	return (
		<span className="semicolon" data-symbol=";">
			&#59;
		</span>
	);
}

// MARK: Colon

// :
export function Colon() {
	return (
		<span className="colon" data-symbol=":">
			&#58;
		</span>
	);
}

// MARK: Hash

// #
export function Hash() {
	return (
		<span className="hash" data-symbol="#">
			&#35;
		</span>
	);
}
