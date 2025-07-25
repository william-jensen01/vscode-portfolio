import { useState, useEffect, useRef, useCallback } from "react";
import Focusable from "../../Focus/Focusable";

export default function NumberInput({ item, itemKey, handleChange }) {
	const [localValue, setLocalValue] = useState(
		item.value !== undefined && typeof item.value === "number"
			? item.value > item.max
				? item.max
				: item.value < item.min
				? item.min
				: item.value
			: item.default
	);
	const [debouncedValue, setDebouncedValue] = useState(localValue);
	const [isInvalid, setIsInvalid] = useState();
	const timeoutRef = useRef(null);
	const inputRef = useRef(null);

	const numberKey = `number.${itemKey}`;

	const validateValue = useCallback(
		(value) => {
			if (value === undefined || value === null) {
				return "Value is required.";
			}

			const numValue = Number(value);
			if (isNaN(numValue)) {
				return "Value must be a number.";
			}

			if (numValue < item.min) {
				return `Value must be greater than or equal to ${item.min}.`;
			}

			if (numValue > item.max) {
				return `Value must be less than or equal to ${item.max}.`;
			}

			return "";
		},
		[item.min, item.max]
	);

	const clampValue = useCallback(
		(value) => {
			const numValue = Number(value);
			if (isNaN(numValue)) {
				return item.default ?? item.min;
			}
			return Math.max(item.min, Math.min(item.max, numValue));
		},
		[item.min, item.max, item.default]
	);

	useEffect(() => {
		if (localValue !== "" && !isNaN(Number(localValue)) && !isInvalid) {
			// Clear any existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Set new timeout
			timeoutRef.current = setTimeout(() => {
				console.log(`Debounced update for ${itemKey}:`, localValue);
				setDebouncedValue(localValue);
				handleChange(itemKey, Number(localValue));
			}, 300);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localValue, itemKey, item, isInvalid]);

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;

		function handleKeyDown(e) {
			if (e.key === "Escape" || e.keyCode === 27) {
				// input.blur();
				// Note for the future:
				// Pressing "escape" when input is focused should move focus to the parent (setting item)
				// Currrently, focus is entirely removed
			} else {
				// Prevent propagation of arrow up/down as that also controls the focus higher up in tree

				e.stopPropagation();
			}
		}

		input.addEventListener("keydown", handleKeyDown);
		return () => {
			if (input) {
				input.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, []);

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		// Validate the new value
		const error = validateValue(newValue);
		setIsInvalid(error);
		// Since we aren't fully restricting the input go ahead and display this new value
		setLocalValue(newValue);
	};

	const handleInputFocus = (e) => {
		e.stopPropagation();
	};

	const handleInputBlur = (e) => {
		// On blur, always ensure we have a valid value

		// Clamp and apply the value
		const numValue = Number(localValue);
		const clampedValue = clampValue(numValue);

		inputRef.current.value = clampedValue;
		setLocalValue(clampedValue);
		setIsInvalid("");
	};

	return (
		<div className="sp-item-number-input-container">
			<Focusable itemKey={numberKey}>
				<input
					ref={inputRef}
					className="sp-item-number-input"
					type="number"
					pattern="[0-9]*"
					value={localValue}
					onChange={handleInputChange}
					autoCorrect="off"
					autoCapitalize="off"
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
				/>
			</Focusable>
			{isInvalid && (
				<div
					id={`${numberKey}-error`}
					className="input-validation-message"
					role="alert"
					aria-live="polite"
				>
					{isInvalid}
				</div>
			)}
		</div>
	);
}
