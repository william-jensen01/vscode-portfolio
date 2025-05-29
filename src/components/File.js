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
	const scrollDecorationRef = useRef(null);
	const raId = useRef(null);

	useEffect(() => {
		const fileContainer = fileContainerRef.current;

		if (!fileContainer) return;

		const handleScroll = (e) => {
			if (raId.current) {
				cancelAnimationFrame(raId.current);
			}

			raId.current = requestAnimationFrame(() => {
				const scrollTop = e.target.scrollTop;
				const scrolled = scrollTop > 0;

				scrollDecorationRef.current.classList.toggle("shadow", scrolled);
			});
		};

		fileContainer.addEventListener("scroll", handleScroll);

		return () => {
			if (fileContainer) {
				fileContainer.removeEventListener("scroll", handleScroll);
			}

			cancelAnimationFrame(raId.current);
		};
	}, []);

	// reset scroll position whenever active file changes
	useEffect(() => {
		fileContainerRef.current.scrollTop = 0;
	}, [activeFile]);

	return (
		<div ref={fileContainerRef} className="file-container">
			<div ref={scrollDecorationRef} className="scroll-decoration" />
			{Component && <Component />}
		</div>
	);
}

export default File;
