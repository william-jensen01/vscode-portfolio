import { useState, useRef, useMemo } from "react";
import useSettingsStore from "../../../store/settingsStore";
import Select from "./Inputs/Select";
import Focusable from "../Focus/Focusable";
import sprite from "../../../assets/svgs-sprite.svg";

export default function SettingsItem({
	item,
	itemKey,
	itemIdx,
	fullNavigation,
}) {
	const [modified, setModified] = useState(item.value !== item.default);

	const changeSpecificSetting = useSettingsStore(
		(state) => state.changeSpecificSetting
	);

	const contentRef = useRef(null);
	const itemRef = useRef(null);

	const formattedPath = useMemo(() => {
		const settingPath = item.navigation;
		// Split the path by dots
		const parts = settingPath.split(".");

		// Process all parts to capitalize first letter and handle camelCase
		const formattedParts = parts.map((part, index) => {
			// Capitalize first letter
			part = part.charAt(0).toUpperCase() + part.slice(1);

			// Convert camelCase to Space Separated Words (only for the last part)
			if (index === parts.length - 1) {
				part = part.replace(/([A-Z])/g, " $1").trim();
			}

			return part;
		});

		// Join all parts except the last one with " > "
		const categoryParts = formattedParts.slice(fullNavigation ? 0 : 1, -1);
		const category = categoryParts.join(" > ");

		// Get the actual item (last part)
		const label = formattedParts.at(-1);

		return (
			<>
				{category && (
					<span className="sp-item-category">
						{category}
						{": "}
					</span>
				)}
				<span className="sp-item-label">{label}</span>
			</>
		);
	}, [item.navigation, fullNavigation]);

	const handleChange = (key, value) => {
		changeSpecificSetting(key, value);
		setModified(value !== item.default);
	};

	return (
		<div
			ref={itemRef}
			className="sp-row sp-item"
			data-item-key={itemKey}
			data-item-idx={itemIdx}
		>
			<Focusable itemKey={itemKey} itemIdx={itemIdx}>
				<div ref={contentRef} className="sp-item-contents">
					<div className="sp-row-inner-container">
						<p className="sp-item-label-container">
							{formattedPath}
						</p>
						<p className="sp-item-description">
							{item.description}
						</p>
						<div className="sp-item-value">
							{item.input === "select" && (
								<div className="sp-item-control sp-item-select-container">
									<Select
										item={item}
										itemKey={itemKey}
										itemIdx={itemIdx}
										handleChange={handleChange}
									/>
								</div>
							)}
						</div>
						{modified && (
							<div className="sp-item-modified-indicator" />
						)}
					</div>
				</div>
			</Focusable>

			<Focusable itemKey={itemKey} itemIdx={itemIdx}>
				<a className="sp-more-action" tabIndex={0}>
					<svg>
						<use href={`${sprite}#icon-settings`} />
					</svg>
				</a>
			</Focusable>
		</div>
	);
}
