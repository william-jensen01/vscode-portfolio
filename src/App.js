import { useState, useMemo } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import File from "./components/File";
import Taskbar from "./components/Taskbar";

import { TaskbarContext } from "./Context/TaskbarContext";
import { ActiveFileContext } from "./Context/ActiveFileContext";

import "./styles/layout.css";
import "./styles/themes.css";

function App() {
  const [taskbarContent, setTaskbarContent] = useState([
    {
      svg: "icon-markdown",
      fileName: "about.md",
      page: "about",
    },
  ]);

  const [activeFile, setActiveFile] = useState({
    svg: "icon-markdown",
    fileName: "about.md",
    page: "about",
  });

  const providerTaskbar = useMemo(
    () => ({ taskbarContent, setTaskbarContent }),
    [taskbarContent]
  );

  const providerActiveFile = useMemo(
    () => ({ activeFile, setActiveFile }),
    [activeFile]
  );

  return (
    <div className="layout">
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
    </div>
  );
}

export default App;
