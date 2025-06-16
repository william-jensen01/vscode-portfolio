import React, { useRef, useEffect } from "react";
import { useFileBoundingRectStore } from "../../../../store/fileBoundingRectStore";
import { useStickyLineStore } from "./stickyStore";
import StickyWidget from "./Widget";
import { throttle } from "../../hooks/useThrottle";

import "./sticky.css";

export default function StickyManager() {
	const containerRef = useRef(null);
	const lastScrollTopRef = useRef(0);
	const initAttemptedRef = useRef(false);

	const fileContainerRef = useFileBoundingRectStore((state) => state.__ref);
	const initialize = useStickyLineStore((state) => state.initialize);
	const systemInitialized = useStickyLineStore(
		(state) => state.systemInitialized
	);
	const handleStickyLineScroll = useStickyLineStore(
		(state) => state.handleScroll
	);
	const refreshSections = useStickyLineStore(
		(state) => state.refreshSections
	);

	// Initialize sticky system when container is available, and not already initialized
	useEffect(() => {
		if (
			!fileContainerRef ||
			initAttemptedRef.current ||
			systemInitialized
		) {
			return;
		}

		initAttemptedRef.current = true;

		initialize();
	}, [fileContainerRef, initialize, systemInitialized]);

	// Set up scroll handler after initialization
	useEffect(() => {
		const container = fileContainerRef;
		if (!container || !systemInitialized) return;

		containerRef.current = container;

		const throttledScroll = throttle((e) => {
			const direction =
				e.target.scrollTop > lastScrollTopRef.current ? 1 : -1;
			lastScrollTopRef.current = e.target.scrollTop;

			handleStickyLineScroll(e.target.scrollTop, direction);
		}, 50);

		container.addEventListener("scroll", throttledScroll);

		return () => {
			container.removeEventListener("scroll", throttledScroll);
		};
	}, [
		fileContainerRef,
		initialize,
		handleStickyLineScroll,
		systemInitialized,
	]);

	// Handle resize events
	useEffect(() => {
		const fileContainer = fileContainerRef;
		if (!fileContainer || !systemInitialized) return;

		const observer = new ResizeObserver((entries) => {
			if (entries.length === 0) return;

			refreshSections();
		});

		observer.observe(fileContainer);

		return () => {
			observer.disconnect();
		};
	}, [fileContainerRef, refreshSections, systemInitialized]);

	return <StickyWidget />;
}
