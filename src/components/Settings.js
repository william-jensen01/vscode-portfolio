import React from "react";
import useSettingsStore from "../store/settingsStore";

import "../styles/settings.css";

function Settings({ close }) {
	const changeSpecificSetting = useSettingsStore(
		(state) => state.changeSpecificSetting
	);
	const setTheme = (theme) => {
		close();
		changeSpecificSetting("theme", theme);
		document.documentElement.setAttribute("data-theme", theme);
	};
	return (
		<div className="settings-container">
			<p>Themes</p>
			<button
				className="settings-theme-option"
				onClick={() => setTheme("atom one dark")}
			>
				Default
			</button>
			<hr />
			<button
				className="settings-theme-option"
				onClick={() => setTheme("darkplus")}
			>
				Dark+
			</button>
			<hr />
			<button
				className="settings-theme-option"
				onClick={() => setTheme("dracula")}
			>
				Dracula
			</button>
		</div>
	);
}

export default Settings;
