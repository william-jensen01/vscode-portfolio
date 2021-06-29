import { useContext } from "react";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { ActiveFileContext } from "../Context/ActiveFileContext";

import "../styles/file.css";

function File() {
  const { activeFile } = useContext(ActiveFileContext);
  return (
    <div className="file-container">
      {activeFile.page === "about" && <About />}
      {activeFile.page === "skills" && <Skills />}
      {activeFile.page === "projects" && <Projects />}
      {activeFile.page === "contact" && <Contact />}
    </div>
  );
}

export default File;
