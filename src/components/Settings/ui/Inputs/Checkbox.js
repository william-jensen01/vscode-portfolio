import { useState, useRef, useEffect } from "react";
import Focusable from "../../Focus/Focusable";

export default function Checkbox({ item, itemKey, handleChange }) {
	const [localValue, setLocalValue] = useState(
		item.value !== undefined && item.value !== null
			? item.value
			: item.default
	);
	const containerRef = useRef(null);
	const inputRef = useRef(null);

	const handleClick = (e) => {
		const newValue = !localValue;
		setLocalValue(newValue);
		handleChange(itemKey, newValue);
	};

	const checkboxKey = `checkbox.${itemKey}`;

	// Handle keyboard events to toggle checkbox
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleKeyDown = (e) => {
			if (e.keyCode === 13 || e.key === " ") {
				e.preventDefault();
				handleClick();
			}
		};

		container.addEventListener("keydown", handleKeyDown);

		return () => {
			if (container) {
				container.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [handleClick]);

	return (
		<Focusable itemKey={checkboxKey}>
			<div
				ref={containerRef}
				className={`sp-value-checkbox ${localValue ? "checked" : ""}`}
			>
				<input
					ref={inputRef}
					id={checkboxKey}
					type="checkbox"
					checked={localValue}
					tabIndex={-1}
					onChange={(e) => {
						handleClick();
					}}
				/>
				<span
					htmlFor={checkboxKey}
					onClick={(e) => {
						handleClick();
					}}
				/>
			</div>
		</Focusable>
	);
}
