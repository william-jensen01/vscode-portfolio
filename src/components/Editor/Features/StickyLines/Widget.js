import React, { useRef, useEffect } from "react";
import { useStickyLineStore } from "./stickyStore";

export default function StickyWidget() {
	const stickyLines = useStickyLineStore((state) => state.stickyLines);

	const widgetLinesRef = useRef(null);

	const lastScrollTopRef = useRef();

	// TODO: move outside of useEffect into a useMemo using a dummy NewLine component

	useEffect(() => {
		if (!widgetLinesRef.current) return;

		// Clear existing lines
		widgetLinesRef.current.innerHTML = "";

		let currentOffset = 0;

		const scrollTop = document.querySelector(".file-container").scrollTop;

		stickyLines.entries().forEach(([lineId, line], idx) => {
			if (!line.element) return;

			const offset = line.offset || 0;
			const clone = line.element.cloneNode(true);

			// Add styles
			clone.style.top = `${Math.floor(offset)}px`;
			clone.style.zIndex = `${stickyLines.size - idx}`;
			if (line.isPhasing) {
				clone.style.top = `${line.offset - line.pixelDiff}px`;
			}

			// Add classes
			clone.classList.toggle(
				"phase",
				line.isPhasing && scrollTop >= lastScrollTopRef.current
			);
			clone.classList.toggle("sticky-first", idx === 0);

			currentOffset += line.height;

			const handleStickyClick = () => {
				const original = document.querySelector(
					`.view-lines .line[data-id="${lineId}"]`
				);
				original.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});

				// highlight for 2 seconds to indicate on page
				original.classList.add("highlight");
				setTimeout(() => {
					original.classList.remove("highlight");
				}, 1500);
			};
			clone.addEventListener("click", handleStickyClick, { once: true });

			widgetLinesRef.current.appendChild(clone);
		});

		lastScrollTopRef.current = scrollTop;
	}, [stickyLines]);

	return (
		<div className="sticky-widget">
			<div className="sticky-widget-lines" ref={widgetLinesRef}></div>
		</div>
	);
}
