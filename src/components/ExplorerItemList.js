import React, { useContext } from "react";
import sprite from "../assets/svgs-sprite.svg";
import { TaskbarContext } from "../Context/TaskbarContext";
import { ActiveFileContext } from "../Context/ActiveFileContext";

import "../styles/explorer.css";

function ExplorerItemList({ listItems }) {
	const { taskbarContent, setTaskbarContent } = useContext(TaskbarContext);

	const { activeFile, setActiveFile } = useContext(ActiveFileContext);

	const handleClick = (item) => {
		const taskbarItem = taskbarContent.find(
			(taskItem) => taskItem.fileName === item.fileName
		);

		// item not in taskbar: add to taskbar
		// set to active file
		if (!taskbarItem) {
			setTaskbarContent([...taskbarContent, item]);
		}
		setActiveFile(item);
	};
	return (
		<div className="exp-item-content">
			{listItems.map((item) => (
				<div
					key={item.fileName}
					className={
						item.fileName === activeFile.fileName
							? "exp-list-item-active"
							: "exp-list-item"
					}
					onClick={() => handleClick(item)}
				>
					<svg className="exp-file-type">
						<use href={sprite + `#${item.svg}`} />
					</svg>
					<p>{item.fileName}</p>
				</div>
			))}
		</div>
	);
}

export default ExplorerItemList;
