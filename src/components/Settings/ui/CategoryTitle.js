import { useRef, useEffect } from "react";

export default function StickyTitle({ children, itemIdx }) {
	const ref = useRef(null);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					ref.current.classList.toggle(
						"sticky",
						entry.intersectionRatio < 1
					);
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
			className="sp-row sp-group-title"
			data-item-idx={itemIdx}
		>
			<h2 className="group-title-label">{children}</h2>
		</div>
	);
}
