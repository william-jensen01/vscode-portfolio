import { useState, useEffect, useRef, useCallback } from "react";
import Focusable from "../../Focus/Focusable";

export default function NumberInput({ item, itemKey, handleChange }) {
	const currentValue =
		item.value !== undefined && typeof item.value === "number"
			? item.value > item.max
				? item.max
				: item.value < item.min
				? item.min
				: item.value
			: item.default;
	// Maintain state for input field separate from setting value
	const [localValue, setLocalValue] = useState(currentValue);
	const [isInvalid, setIsInvalid] = useState();
	const timeoutRef = useRef(null);
	const inputRef = useRef(null);
	const lastPropValue = useRef(currentValue);

	const numberKey = `number.${itemKey}`;

	// Sync local value when prop changes externally
	useEffect(() => {
		if (currentValue !== lastPropValue.current) {
			setLocalValue(currentValue);
			lastPropValue.current = currentValue;
		}
	}, [currentValue]);

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
			if (isNaN(numValue) || numValue === 0) {
				return item.value;
			}
			return Math.max(item.min, Math.min(item.max, numValue));
		},
		[item.min, item.max, item.default, item.value]
	);

	const updateStore = useCallback(
		(value) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				if (!isNaN(value)) {
					handleChange(itemKey, value);
				}
			}, 300);
		},
		[itemKey, handleChange, item.min, item.max]
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

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
		let newValue = e.target.value;
		// Since we aren't fully restricting the input go ahead and display this new value
		setLocalValue(newValue);

		// Validate the new value
		const error = validateValue(newValue);
		setIsInvalid(error);

		if (!error) {
			// Only update store if there are no errors
			updateStore(Number(newValue));
		}
	};

	const handleInputFocus = (e) => {
		e.stopPropagation();
	};

	const handleInputBlur = (e) => {
		// On blur, always ensure we have a valid value

		// Clamp and apply the value
		const clampedValue = clampValue(localValue);

		inputRef.current.value = clampedValue;
		setLocalValue(clampedValue);
		setIsInvalid("");
		if (clampedValue !== currentValue) {
			updateStore(clampedValue);
		}
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
