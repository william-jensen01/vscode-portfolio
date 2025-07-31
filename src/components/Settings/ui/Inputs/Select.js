import { useState, useRef, useEffect } from "react";
import Focusable from "../../Focus/Focusable";

export default function Select({ item, itemKey, handleChange }) {
	const currentOption =
		item.value !== null && item.value !== undefined
			? item.value
			: item.default;

	const [focusedOption, setFocusedOption] = useState(currentOption);
	const containerRef = useRef(null);
	const listRef = useRef(null);
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);

	const selectKey = `select.${itemKey}`;
	const [open, setOpen] = useState(false);

	const focusSelectedInput = () => {
		requestAnimationFrame(() => {
			const input = listRef.current?.querySelector(".selected input");
			input?.focus();
		});
	};

	const handleSelectClick = (e) => {
		e.stopPropagation();

		focusSelectedInput();
		setOpen((prev) => !prev);
	};

	const handleOptionSelect = (optionIdx) => {
		setFocusedOption(optionIdx);
		handleChange(itemKey, optionIdx);
		setOpen(false);
		buttonRef.current.focus();
	};

	function handleKeyDown(e) {
		// Prevent propagation of arrow up/down as that also controls the focus higher up in tree
		if (
			e.key === "ArrowDown" ||
			e.keyCode === 40 ||
			e.key === "ArrowUp" ||
			e.keyCode === 38
		) {
			if (!open) return;
			e.stopPropagation();
		}

		if (e.key === "Enter" || e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();

			if (open) {
				// Closing the dropdown -> complete option selection
				handleOptionSelect(focusedOption);
			} else {
				// Opening the dropdown -> focus the selected input
				focusSelectedInput();
			}

			setOpen(!open);
		}
		if (e.key === "Escape" || e.keyCode === 27) {
			e.stopPropagation();
			// Close the dropdown and bring focus back to the button
			setOpen(false);
			buttonRef.current.focus();
		}
	}

	// Update focused option when the value changes externally
	useEffect(() => {
		setFocusedOption(currentOption);
	}, [currentOption]);

	useEffect(() => {
		const dropdown = containerRef.current;
		if (!dropdown) return;

		dropdown.addEventListener("keydown", handleKeyDown);

		return () => {
			if (dropdown) {
				dropdown.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [handleKeyDown]);

	// Focus listener that closes the dropdown when focus leaves
	useEffect(() => {
		const parent = containerRef.current;
		if (!parent) return;

		const handleFocusOut = (e) => {
			const focusMovingTo = e.relatedTarget;

			// Check if focus is moving to another element within the parent
			if (parent.contains(focusMovingTo)) {
				return; // Don't close if focus is still within the component
			}

			if (!focusMovingTo || !parent.contains(focusMovingTo)) {
				requestAnimationFrame(() => {
					if (!parent.contains(document.activeElement)) {
						setOpen(false);
					}
				});
			}
		};

		parent.addEventListener("focusout", handleFocusOut);

		return () => {
			if (parent) {
				parent.removeEventListener("focusout", handleFocusOut);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={`sp-item-select-box ${open ? "open" : ""}`}
			role="combobox"
			aria-labelledby="select button"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls="select-dropdown"
		>
			<Focusable itemKey={selectKey}>
				<button
					ref={buttonRef}
					id={`${itemKey}.select-button`}
					className={`select-button ${open ? "focused" : ""}`}
					style={{
						textTransform: item?.capitalize ? "capitalize" : "",
					}}
					onClick={handleSelectClick}
					disabled={item["input_disabled"]}
					role="combobox"
					aria-label="select button"
					aria-haspopup="options"
					aria-controls={`${itemKey}.dropdown`}
					tabIndex={0}
				>
					<span className="selected-value">
						{item.options[currentOption]?.value}
					</span>
					<span className="arrow" />
				</button>
			</Focusable>

			{open && (
				<div
					ref={dropdownRef}
					className="select-dropdown"
					id={`${itemKey}.dropdown`}
					aria-labelledby={`${itemKey}.select-button`}
					role="listbox"
				>
					<ul ref={listRef} className="">
						{item?.options.map((option, idx) => (
							<SelectItem
								key={`${itemKey}.option.${idx}`}
								idx={idx}
								option={option}
								item={item}
								itemKey={itemKey}
								selectKey={selectKey}
								currentOption={currentOption}
								focusedOption={focusedOption}
								setFocusedOption={setFocusedOption}
								onSelect={handleOptionSelect}
							/>
						))}
					</ul>

					{item.options[focusedOption]?.description && (
						<div className="select-box-details-pane">
							<div className="select-box-description-markdown">
								{item.options[focusedOption]?.description}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
function SelectItem({
	idx,
	item,
	itemKey,
	selectKey,
	option,
	currentOption,
	focusedOption,
	setFocusedOption,
	onSelect,
}) {
	const optionRef = useRef(null);

	const handleClick = (e) => {
		// Only register actual clicks (not keyboard events)
		if (e.detail > 0) {
			onSelect(idx);
		}
	};

	const isDefault = item.default === idx;
	const isSelected = currentOption === idx;
	const isFocused = focusedOption === idx;

	const additionalClasses = [
		isDefault ? "default" : "",
		isFocused ? "focused" : "",
		isSelected ? "selected" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<li
			ref={optionRef}
			className={additionalClasses}
			// using mouseDown instead of click to prevent focus from firing before click and preventing invokation due closed dropdown
			onMouseDown={handleClick}
			onFocus={() => setFocusedOption(idx)}
			onMouseEnter={(e) => {
				// Recreate the onFocus handler result
				setFocusedOption(idx);
				const input = e.target.querySelector("input[type='radio']");
				if (!input) return;
				console.log("input focusing");
				input.checked = true;
				input.focus();
			}}
		>
			<input
				id={`${selectKey}-option.${idx}`}
				type="radio"
				name={`${selectKey}.dropdown`}
				value={option.value}
				defaultChecked={isSelected}
				// role="option"
				// aria-checked={isSelected || isFocused}
				// aria-selected={isSelected || isFocused}
			/>
			<label
				htmlFor={`${selectKey}-option.${idx}`}
				style={{ textTransform: item?.capitalize ? "capitalize" : "" }}
			>
				{option?.value}
			</label>
			{isDefault && <span>default</span>}
		</li>
	);
}
