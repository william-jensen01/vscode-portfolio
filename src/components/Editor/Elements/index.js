import React from "react";

// MARK: Quotation

// "content"
export function Quotation({ children, content }) {
	return children ? (
		React.Children.map(children, (child) => (
			<span className="quotation">"{child}"</span>
		))
	) : content ? (
		<span className="quotation">"{content}"</span>
	) : (
		new Error("No children or content provided.")
	);
}

// MARK: Space

export function Space() {
	return <span className="space">&nbsp;</span>;
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
