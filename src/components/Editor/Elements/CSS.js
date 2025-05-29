import React from "react";
import { Quotation } from "../Elements";
import Bracket from "./Bracket";

// MARK: Function

// children[0] = name
// children[1] = value
export function Fn({ children }) {
	const childrenArr = React.Children.toArray(children);
	if (childrenArr.length < 2) {
		throw new Error("Fn component must have at least two children");
	}
	return (
		<>
			<span className="fn">{childrenArr[0]}</span>
			<Bracket character="(" editorClass="css" />
			{childrenArr.splice(1)}
			<Bracket character=")" editorClass="css" />
		</>
	);
}

// MARK: Comment

/* content */
export function Comment({ children, content }) {
	return children ? (
		React.Children.map(children, (child, idx) => (
			<span
				key={`comment-${idx}`}
				className="comment"
			>{` /* ${child} */`}</span>
		))
	) : content ? (
		<span className="comment">{` /* ${content} */`}</span>
	) : (
		new Error("No children or content provided.")
	);
}

// MARK: Url

// url("link")
export function Url({ children, link }) {
	return (
		<Fn>
			{[
				"url",
				<a href={children} target="_blank" rel="noopener noreferrer">
					<Quotation>{children}</Quotation>
				</a>,
			]}
		</Fn>
	);
}

// MARK: Numerical

export function Numerical({ children, value }) {
	const extractValueAndUnit = (value) => {
		const matches = value.match(/^(-?\d*\.?\d+)(.*)$/);
		if (!matches) return null;
		return [parseFloat(matches[1]), matches[2]];
	};

	return children ? (
		React.Children.map(children, (child) => {
			const extract = extractValueAndUnit(child);
			if (Array.isArray(extract)) {
				return (
					<>
						<span className="numerical">{extract[0]}</span>
						{extract[1] && (
							<span className="unit">{extract[1]}</span>
						)}
					</>
				);
			}
		})
	) : value ? (
		<>
			<span className="numerical">{`${value[0]}`}</span>
			<span className="unit">{value[1]}</span>
		</>
	) : (
		new Error("No children or content provided.")
	);
}
