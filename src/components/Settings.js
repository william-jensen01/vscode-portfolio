import React from "react";

import "../styles/settings.css";

function Settings({ close }) {
  const setTheme = (theme) => {
    close();
    document.documentElement.setAttribute("data-theme", theme);
  };
  return (
    <div className="settings-container">
      <p>Themes</p>
      <button
        className="settings-theme-option"
        onClick={() => document.documentElement.removeAttribute("data-theme")}
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
