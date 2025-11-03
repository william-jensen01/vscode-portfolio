import { useLayoutEffect, useRef } from "react";
import { useStickyStore } from "./store";
import { throttle } from "../../Editor/hooks/useThrottle";
import StickyWidget from "./Widget";

export default function StickyManager({ containerRef, disabled }) {
	const lastScrollTopRef = useRef(0);
	const handleScroll = useStickyStore((state) => state.handleScroll);

	useLayoutEffect(() => {
		console.log("StickyManager :: testing container", containerRef);
		if (!containerRef) return;

		containerRef.scrollTop = 0;

		const throttledScroll = throttle(handleScroll, 50);

		const handler = (e) => {
			const direction =
				e.target.scrollTop > lastScrollTopRef.current ? 1 : -1;
			lastScrollTopRef.current = e.target.scrollTop;
			if (e.target.scrollTop === 0) {
				handleScroll(e.target.scrollTop, direction);
			} else {
				throttledScroll(e.target.scrollTop, direction);
			}
		};

		containerRef.addEventListener("scroll", handler);

		return () => {
			containerRef.removeEventListener("scroll", handler);
		};
	}, [containerRef, handleScroll]);

	return <StickyWidget disabled={disabled} />;
}
