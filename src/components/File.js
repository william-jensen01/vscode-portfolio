import { useContext, useRef, useEffect, useMemo } from "react";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { ActiveFileContext } from "../Context/ActiveFileContext";
import {
	FileBoundingRectContext,
	useFileBoundingRectFromStore,
	createFileBoundingRectStore,
} from "../store/fileBoundingRectStore";

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

	const fileBoundingRectStore = useMemo(
		() => createFileBoundingRectStore(),
		[]
	);

	const setRef = useFileBoundingRectFromStore(
		fileBoundingRectStore,
		(state) => state.setRef
	);
	const updateRect = useFileBoundingRectFromStore(
		fileBoundingRectStore,
		(state) => state.updateRect
	);

	useEffect(() => {
		if (!fileContainerRef.current) return;

		setRef(fileContainerRef.current);
	}, [setRef]);

	useEffect(() => {
		const fileContainer = fileContainerRef.current;
		if (!fileContainer) return;

		const updateBoundingClientRect = () => {
			const rect = fileContainer.getBoundingClientRect();
			updateRect(rect);
		};

		const resizeObserver = new ResizeObserver(updateBoundingClientRect);
		resizeObserver.observe(fileContainer);

		return () => {
			resizeObserver.disconnect();
		};
	}, [updateRect]);

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

				scrollDecorationRef.current.classList.toggle(
					"shadow",
					scrolled
				);
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
		<FileBoundingRectContext.Provider value={fileBoundingRectStore}>
			<div ref={fileContainerRef} className="file-container">
				<div ref={scrollDecorationRef} className="scroll-decoration" />
				{Component && <Component />}
			</div>
		</FileBoundingRectContext.Provider>
	);
}

export default File;
