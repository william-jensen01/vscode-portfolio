import { useContext } from "react";
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
	const Component = COMPONENTS[activeFile.page];
	return (
		<div className="file-container">
			<Component />
		</div>
	);
}

export default File;
