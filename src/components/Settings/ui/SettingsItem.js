import { useRef, useMemo, memo } from "react";
import useSettingsStore from "../../../store/settingsStore";
import MoreActions from "./MoreActions";
import Select from "./Inputs/Select";
import Checkbox from "./Inputs/Checkbox";
import Number from "./Inputs/Number";
import Focusable from "../Focus/Focusable";
import FocusRow from "../Focus/Row";

const SettingsItem = memo(({ item, itemKey, itemIdx, fullNavigation }) => {
	const modified = item.value !== item.default;

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

			// Convert camelCase to Space Separated Words
			part = part.replace(/([A-Z])/g, " $1").trim();

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
	};

	return (
		<FocusRow itemIdx={itemIdx} itemKey={itemKey}>
			<div className={`sp-item ${item.input}`}>
				<Focusable itemKey={itemKey} itemIdx={itemIdx}>
					<div ref={contentRef} className="sp-item-contents">
						<div className="sp-row-inner-container">
							<p className="sp-item-label-container">
								{formattedPath}
							</p>
							{item.input === "checkbox" ? (
								<div className="sp-item-value-description">
									<Checkbox
										item={item}
										itemKey={itemKey}
										handleChange={handleChange}
									/>
									<label htmlFor={`checkbox.${itemKey}`}>
										<p className="sp-item-description">
											{item.description}
										</p>
									</label>
								</div>
							) : (
								<div className="sp-item-description">
									{!item.markdown && (
										<p>{item.description}</p>
									)}
									{item.markdown && (
										<div
											className="sp-item-markdown"
											dangerouslySetInnerHTML={{
												__html: item.markdown,
											}}
										/>
									)}
								</div>
							)}
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
								{item.input === "number" && (
									<div className="sp-item-control sp-item-number-container">
										<Number
											item={item}
											itemKey={itemKey}
											handleChange={handleChange}
										/>
									</div>
								)}
							</div>
							{modified && (
								<div className="sp-item-modified-indicator" />
							)}

							<div className="sp-toolbar-container">
								<MoreActions
									itemKey={itemKey}
									itemIdx={itemIdx}
									item={item}
								/>
							</div>
						</div>
					</div>
				</Focusable>
			</div>
		</FocusRow>
	);
});
export default SettingsItem;
