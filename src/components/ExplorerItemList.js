import React, { useContext } from "react";
import sprite from "./assets/svgs-sprite.svg";
import { TaskbarContext } from "../Context/TaskbarContext";
import { ActiveFileContext } from "../Context/ActiveFileContext";

import "../styles/explorer.css";

function ExplorerItemList({ listItems }) {
  const { taskbarContent, setTaskbarContent } = useContext(TaskbarContext);

  const { activeFile, setActiveFile } = useContext(ActiveFileContext);

  const handleClick = (item) => {
    // if item is in taskbar, set active file to it and highlight item in taskbar
    let temp = null;
    for (let i = 0; i < taskbarContent.length; i++) {
      if (taskbarContent[i].fileName === item.fileName) {
        temp = 1;
        setActiveFile(item);
      }
    }

    // if item not in taskbar, add it and set it as the active file
    if (!temp) {
      setTaskbarContent([...taskbarContent, item]);
      setActiveFile(item);
    }
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
