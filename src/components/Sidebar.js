import React, { useState, useRef } from "react";
import { useOutsideToggle } from "../util/useOutsideToggle";
import Explorer from "./Explorer";
import sprite from "../assets/svgs-sprite.svg";
import Settings from "./Settings";

import "../styles/sidebar.css";

function Sidebar() {
	const [explorerOpen, setExplorerOpen] = useState(false);

	const [settingsOpen, setSettingsOpen] = useState(false);
	const settingsRef = useRef();
	const closeSettings = () => {
		setSettingsOpen(false);
	};
	useOutsideToggle(settingsRef, closeSettings);

	return (
		<div className="sidebar-container">
			<div className="sidebar">
				<div className="sb-top">
					<svg
						className="sb-icon"
						onClick={() => setExplorerOpen(!explorerOpen)}
					>
						<use xlinkHref={sprite + "#icon-file"} />
					</svg>
					<a
						href="https://github.com/william-jensen01"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg className="sb-icon">
							<use xlinkHref={sprite + "#icon-github"} />
						</svg>
					</a>

					<a
						href="https://www.linkedin.com/in/williambjensen/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg className="sb-icon">
							<use href={sprite + "#icon-linkedin"} />
						</svg>
					</a>
					<a
						href="https://twitter.com/wbjensen"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg className="sb-icon">
							<use xlinkHref={sprite + "#icon-twitter"} />
						</svg>
					</a>
					<svg className="sb-icon">
						<use xlinkHref={sprite + "#icon-mail"}></use>
					</svg>
				</div>
				<div className="sb-bottom">
					<svg className="sb-icon">
						<use xlinkHref={sprite + "#icon-account"} />
					</svg>
					<div ref={settingsRef}>
						<svg
							className="sb-icon"
							onClick={() => setSettingsOpen(!settingsOpen)}
						>
							<use xlinkHref={sprite + "#icon-settings"} />
						</svg>
						{settingsOpen && <Settings close={closeSettings} />}
					</div>
				</div>
			</div>
			{explorerOpen && <Explorer />}
		</div>
	);
}

export default Sidebar;
