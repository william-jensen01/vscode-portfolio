import { useContext, useRef, useEffect } from "react";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { ActiveFileContext } from "../Context/ActiveFileContext";

import "../styles/file.css";

const COMPONENTS = {
	about: About,
	skills: Skills,
	projects: Projects,
	contact: Contact,
};

function File() {
	const { activeFile } = useContext(ActiveFileContext);
	const Component = COMPONENTS[activeFile?.page];
	const fileContainerRef = useRef(null);

	// reset scroll position whenever active file changes
	useEffect(() => {
		fileContainerRef.current.scrollTop = 0;
	}, [activeFile]);

	return (
		<div ref={fileContainerRef} className="file-container">
			{Component && <Component />}
		</div>
	);
}

export default File;
