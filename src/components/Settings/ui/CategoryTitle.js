import { useRef, useEffect } from "react";
import Focusable from "../Focus/Focusable";
import FocusRow from "../Focus/Row";

export default function StickyTitle({ children, itemIdx }) {
	const ref = useRef(null);
	const titleRef = useRef(null);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					console.log("entry", entry.intersectionRatio);
					titleRef.current.classList.toggle(
						"sticky",
						entry.intersectionRatio < 1
					);
					ref.current.style.zIndex =
						entry.intersectionRatio < 1 ? 3 : "unset";
				});
			},
			{ threshold: [1] }
		);

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div
			ref={ref}
			style={{
				position: "sticky",
				top: "-1px",
				backgroundColor: "var(--file-bg)",
			}}
		>
			<FocusRow itemIdx={itemIdx}>
				<div
					ref={titleRef}
					className="sp-group-title"
					data-item-idx={itemIdx}
				>
					<Focusable itemKey={`title.${children}`} itemIdx={itemIdx}>
						<h2 className="group-title-label sp-row-inner-container">
							{children}
						</h2>
					</Focusable>
				</div>
			</FocusRow>
		</div>
	);
}
