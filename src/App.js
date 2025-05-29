import { useState, useMemo } from "react";
import { HotKeys } from "react-hotkeys";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import File from "./components/File";
import Taskbar from "./components/Taskbar";

import { TaskbarContext } from "./Context/TaskbarContext";
import { ActiveFileContext } from "./Context/ActiveFileContext";

import "./styles/layout.css";
import "./styles/themes.css";

export const portfolioContent = [
	{
		svg: "icon-markdown",
		fileName: "about.md",
		page: "about",
	},
	{
		svg: "icon-js",
		fileName: "skills.js",
		page: "skills",
	},
	{
		svg: "icon-html",
		fileName: "projects.html",
		page: "projects",
	},
	{
		svg: "icon-css",
		fileName: "contact.css",
		page: "contact",
	},
];

function App() {
	const [taskbarContent, setTaskbarContent] = useState(portfolioContent);

	const [activeFile, setActiveFile] = useState(portfolioContent[0]);

	const providerTaskbar = useMemo(
		() => ({ taskbarContent, setTaskbarContent }),
		[taskbarContent]
	);

	const providerActiveFile = useMemo(
		() => ({ activeFile, setActiveFile }),
		[activeFile]
	);

	const keyMap = {
		change_theme: "w",
	};
	const handlers = {
		change_theme: () => console.log("change theme hotkey"),
	};

	return (
		<div className="layout">
			<HotKeys keyMap={keyMap} handlers={handlers}>
				<ActiveFileContext.Provider value={providerActiveFile}>
					<div className="top-container">
						<Header />
					</div>
					<TaskbarContext.Provider value={providerTaskbar}>
						<div className="main">
							<div className="left-container">
								<Sidebar />
							</div>
							<div className="main-container">
								<Taskbar />
								<File />
							</div>
						</div>
					</TaskbarContext.Provider>
				</ActiveFileContext.Provider>
			</HotKeys>
		</div>
	);
}

export default App;
