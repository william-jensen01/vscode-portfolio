import React from "react";
import { Space } from "./Elements";
import Scope from "./Features/Scope";
import NewLine from "./Elements/Line";
import Bracket from "./Elements/Bracket";

export function HTML({ children }) {
	return children;
}

export function Tag({ closing, children }) {
	return (
		<>
			<Bracket character="<" isClosingTag={closing} editorClass="html" />
			{closing && (
				<span className="bracket angle" data-symbol="/">
					&#47;
				</span>
			)}

			<span className="html-tag-name">{children}</span>
			<Bracket character=">" isClosingTag={closing} editorClass="html" />
		</>
	);
}

export function List({ ordered, unordered, children, ...props }) {
	if (ordered && unordered) {
		console.warn(
			"List component should only receive either ordered or unordered prop, not both"
		);
		return null;
	}

	if (!ordered && !unordered) {
		console.warn(
			"List component must receive either ordered or unordered prop"
		);
		return null;
	}

	const listType = ordered ? "ol" : "ul";

	const items = React.Children.toArray(children).filter(
		(child) => child.type === List.Item
	);

	return (
		<Scope>
			<NewLine>
				<Tag>{listType}</Tag>
			</NewLine>
			{items}
			<NewLine>
				<Tag closing>{listType}</Tag>
			</NewLine>
		</Scope>
	);
}

// <li> item </li>
List.Item = ({ children }) => {
	return (
		<NewLine>
			<Tag>li</Tag>
			<Space />
			<span className="html-text">{children}</span>
			<Space />
			<Tag closing>li</Tag>
		</NewLine>
	);
};
