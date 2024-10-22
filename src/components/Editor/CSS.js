import React from "react";
import {
	NewLine,
	Quotation,
	Comment,
	Url,
	ColorPreview,
	Numerical,
	Colon,
	SemiColon,
	OpenCurlyBrace,
	CloseCurlyBrace,
} from "./index";

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
					console.warn("CSS component should only contain CSS.Rule components");
				}
				return acc;
			}, [])}
		</>
	);
}

CSS.Rule = ({ children }) => {
	const childrenArray = React.Children.toArray(children);
	const selector = childrenArray.filter((child) => child.type === CSS.Selector);
	if (selector.length > 1) {
		throw new Error("CSS.Rule component can only have one CSS.Selector");
	}
	return (
		<>
			{children}
			<NewLine>
				<CloseCurlyBrace css />
			</NewLine>
		</>
	);
};

CSS.Selector = ({ children }) => (
	<NewLine>
		<p>
			<span className="css-selector" data-symbol=".">
				&#46;{children}
			</span>
			&nbsp;
			<OpenCurlyBrace css />
		</p>
	</NewLine>
);

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

	const formattedProperty = property ? property.replace(/\s+/g, "-") : "";
	if (commented) {
		return (
			<NewLine indent>
				<Comment>{commented}</Comment>
			</NewLine>
		);
	}
	return (
		<NewLine indent>
			<p>
				{formattedProperty}
				<Colon />
				&nbsp;
				{values.reduce((acc, valueArr, idx) => {
					let type;
					let value = valueArr[0];
					if (valueArr.length >= 2) {
						type = valueArr[1];
					}
					if (idx > 0) {
						acc.push(separator);
					}
					switch (type) {
						case "str":
							acc.push(<Quotation>{value}</Quotation>);
							break;
						case "url":
							acc.push(<Url>{value}</Url>);
							break;
						case "color":
							acc.push(<ColorPreview>{value}</ColorPreview>);
							break;
						case "numerical":
							acc.push(<Numerical>{value}</Numerical>);
							break;
						default:
							acc.push(value);
							break;
					}
					return acc;
				}, [])}
				<SemiColon />
				{commentComponent}
			</p>
		</NewLine>
	);
};
