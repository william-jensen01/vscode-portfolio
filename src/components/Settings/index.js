import React from "react";
import useSettingsStore from "../../store/settingsStore";

import "../../styles/settings.css";

function Settings({ close }) {
	const changeSpecificSetting = useSettingsStore(
		(state) => state.changeSpecificSetting
	);
	const theme = useSettingsStore((state) => state.theme);

	const setTheme = (theme) => {
		close();
		changeSpecificSetting("theme", theme);
		// document.documentElement.setAttribute("data-theme", theme.value);
	};
	return (
		<div className="settings-container">
			<p>Themes</p>
			{theme?.options.map((option, idx) => (
				<React.Fragment key={`theme-option.${idx}`}>
					<button
						className="settings-theme-option"
						onClick={() => setTheme(option)}
					>
						{option.value}
					</button>

					{idx < theme.options.length - 1 && <hr />}
				</React.Fragment>
			))}
		</div>
	);
}

export default Settings;
