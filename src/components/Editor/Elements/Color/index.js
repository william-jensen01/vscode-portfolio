import React, { useState } from "react";
import {
	generateRandomHSLColor,
	hexToHSL,
	hslToHex,
	extractHSLValues,
} from "./helper";
import { Numerical, Fn } from "../../Elements/CSS";
import { Space } from "../../Elements";
import "./color-preview.css";

export default function ColorPreview() {
	const [state, setState] = useState(generateRandomHSLColor());
	const converted = hslToHex(state);

	const values = extractHSLValues(state);
	const reducedValues = values.reduce((acc, child, idx) => {
		if (idx > 0) {
			acc.push(
				<>
					<span className="css-separator">{","}</span>
					<Space />
				</>
			);
		}
		acc.push(<Numerical>{child}</Numerical>);
		return acc;
	}, []);

	return (
		<div className="color-preview">
			<input
				name="swatch"
				type="color"
				value={converted}
				onChange={(e) => {
					setState(hexToHSL(e.target.value));
				}}
			/>
			<span style={{ backgroundColor: state }}>
				<Fn>{["hsl", reducedValues]}</Fn>
			</span>
			<Space />
			<button className="editor-line-button">
				<div
					className="editor-line-icon"
					onClick={() => {
						setState(generateRandomHSLColor());
					}}
				>
					<svg
						viewBox="0 0 16 16"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M4.681 3H2V2h3.5l.5.5V6H5V4a5 5 0 1 0 4.53-.761l.302-.954A6 6 0 1 1 4.681 3z"
						/>
					</svg>
				</div>
			</button>
		</div>
	);
}
