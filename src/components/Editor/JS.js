import React from "react";
import NewLine from "./Elements/Line";
import Bracket from "./Elements/Bracket";
import { SemiColon, Space } from "./Elements";

export function JS({ children }) {
	return children;
}

export function Require({ children }) {
	// const package = React.Children.
	const childrenArray = React.Children.toArray(children);
	const items = childrenArray.filter((child) => child.type === Require.Item);
	const packages = childrenArray.filter(
		(child) => child.type === Require.Package
	);

	if (items.length === 0)
		throw new Error("Require must have at least one itme");

	if (packages.length === 0)
		throw new Error("Require must have at least one package");

	return (
		<NewLine>
			<span className="js-import-word">import</span>
			<Space />
			{items}
			<Space />
			<span className="js-import-word-from">from</span>
			<Space />
			<span className="js-import-source">{packages}</span>
			<SemiColon />
		</NewLine>
	);
}
Require.Item = ({ children, brace }) => {
	return (
		<>
			{brace && (
				<>
					<Bracket character="{" />
					{/* <OpenCurlyBrace js /> */}
					<Space />
				</>
			)}
			<span className="js-import-named">{children}</span>
			{brace && (
				<>
					<Space />
					<Bracket character="}" />
				</>
			)}
		</>
	);
};
Require.Package = ({ children }) => {
	return <>"{children}"</>;
	// return <span className="location">"{children}"</span>;
};
