import React from "react";
import { Comment, Fn, Numerical, Url } from "./Elements/CSS";
import Scope from "./Features/Scope";
import NewLine from "./Elements/Line";
import ColorPreview from "./Elements/Color";
import {
	Colon,
	SemiColon,
	Space,
	Quotation,
	renderWithSpaces,
} from "./Elements";
import Bracket from "./Elements/Bracket";

export function CSS({ children }) {
	const childrenArray = React.Children.toArray(children);
	childrenArray.forEach((child) => {
		if (child.type !== CSS.Rule) {
			throw new Error(
				"CSS component can only have CSS.Rule as direct children "
			);
		}
	});

	return (
		<>
			{childrenArray.reduce((acc, child, idx) => {
				if (child.type === CSS.Rule) {
					if (idx > 0) {
						acc.push(<NewLine key={`newline-${idx}`} />);
					}
					acc.push(React.cloneElement(child, { key: `rule-${idx}` }));
				} else {
					console.warn(
						"CSS component should only contain CSS.Rule components"
					);
				}
				return acc;
			}, [])}
		</>
	);
}

CSS.Rule = ({ children }) => {
	const declarations = [];
	const selectors = [];

	children.forEach((child) => {
		if (child.type === CSS.Selector) {
			return selectors.push(child);
		}
		if (child.type === CSS.Declaration) {
			return declarations.push(child);
		}
	});

	if (selectors.length > 1) {
		throw new Error("CSS.Rule component can only have one CSS.Selector");
	}

	return (
		<Scope>
			{selectors}
			{declarations}
			{/* {children} */}
			<NewLine>
				<Bracket character="}" />
			</NewLine>
		</Scope>
	);
};

CSS.Selector = ({ children }) => (
	<NewLine>
		<span className="css-selector" data-symbol=".">
			&#46;{children}
		</span>
		<Space />
		<Bracket character="{" />
	</NewLine>
);

const typeMapPattern = {
	str: Quotation,
	url: Url,
	color: ColorPreview,
	numerical: Numerical,
	function: Fn,
};

CSS.Declaration = ({
	children,
	property,
	values,
	separator = " ",
	commented,
}) => {
	if (!Array.isArray(values)) {
		throw new Error(
			"CSS.Declaration component must have a non-empty array value"
		);
	}
	const formattedProperty = property ? property.replace(/\s+/g, "-") : "";

	const childrenArray = React.Children.toArray(children);

	let commentComponent;
	// Find the Comment component if it exists
	const commentIdx = childrenArray.findIndex(
		(child) => React.isValidElement(child) && child.type === Comment
	);
	if (commentIdx !== -1) {
		commentComponent = childrenArray[commentIdx];
		childrenArray.splice(commentIdx, 1);
	}

	if (commented) {
		return (
			<NewLine>
				<Comment>{commented}</Comment>
			</NewLine>
		);
	}
	return (
		<NewLine>
			{formattedProperty}
			<Colon />
			<Space />
			{values.reduce((acc, valueArr, idx) => {
				let type;
				let value = valueArr[0];
				if (valueArr.length >= 2) {
					type = valueArr[1];
				}
				if (idx > 0) {
					let elementSeparator = separator;
					if (separator !== " ") {
						elementSeparator = (
							<React.Fragment>
								<span className="punctuation">{separator}</span>
								<Space />
							</React.Fragment>
						);
					} else {
						elementSeparator = <Space />;
					}
					acc.push(elementSeparator);
				}

				const Component = typeMapPattern[type];
				if (typeMapPattern.hasOwnProperty(type)) {
					acc.push(<Component>{value}</Component>);
				} else {
					acc.push(
						<span
							className={valueArr.length >= 3 ? valueArr[2] : ""}
						>
							{value}
						</span>
					);
				}

				return acc;
			}, [])}
			<SemiColon />
			{commentComponent && (
				<>
					<Space />
					{commentComponent}
				</>
			)}
		</NewLine>
	);
};
