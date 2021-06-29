import { useContext } from "react";
import { TaskbarContext } from "../Context/TaskbarContext";
import sprite from "./assets/svgs-sprite.svg";
import { ActiveFileContext } from "../Context/ActiveFileContext";

import "../styles/taskbar.css";

function Taskbar() {
  const { taskbarContent, setTaskbarContent } = useContext(TaskbarContext);
  const { activeFile, setActiveFile } = useContext(ActiveFileContext);

  const removeItem = (file) => {
    if (taskbarContent.length > 1) {
      // remove item from taskbar by filtering it out
      const filteredTaskbar = taskbarContent.filter((item) => {
        return item.fileName !== file.fileName;
      });
      setTaskbarContent(filteredTaskbar);

      // if selected file is the active file, change active file to be anything in the filtered taskbar
      if (file.fileName === activeFile.fileName) {
        setActiveFile(
          filteredTaskbar[Math.floor(Math.random() * filteredTaskbar.length)]
        );
      }
    }
  };

  return (
    <div className="taskbar">
      {taskbarContent.map((file) => (
        <div
          key={file.fileName}
          className={
            file.fileName === activeFile.fileName ? "tb-file-active" : "tb-file"
          }
        >
          <svg className="tb-icon">
            <use href={`${sprite}#${file.svg}`} />
          </svg>
          <p onClick={() => setActiveFile(file)}>{file.fileName}</p>
          <svg onClick={() => removeItem(file)} className="tb-close">
            <use href={sprite + "#icon-close"} />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default Taskbar;
