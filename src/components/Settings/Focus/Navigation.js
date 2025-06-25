import {
	useState,
	useCallback,
	useEffect,
	useMemo,
	createContext,
} from "react";

export const FocusContext = createContext(null);

export default function FocusNavigation({
	children,
	categories,
	containerRef,
}) {
	const [focusedItem, setFocusedItem] = useState("");

	const navigableItemsMatrix = useMemo(() => {
		const matrix = [];

		Object.entries(categories).forEach(([title, category]) => {
			matrix.push([`title.${title}`, ...Object.keys(category)]);
		});

		return matrix;
	}, [categories]);

	const getCoordsByItem = useCallback((itemIdx) => {
		const idxs = itemIdx.split(".");
		if (Array.isArray(idxs) && idxs.length === 2) {
			return { cdx: idxs[0], rdx: idxs[1] };
		}
		return null;
	}, []);

	const getLastRowIndex = useCallback((cdx) => {
		if (cdx < 0 || cdx >= navigableItemsMatrix.length) return -1;
		return navigableItemsMatrix[cdx].length - 1;
	}, []);

	const navigateUp = useCallback(
		(currentCoords) => {
			if (typeof currentCoords !== "object" || currentCoords === null)
				return;

			const { cdx, rdx } = currentCoords;

			if (rdx > 0) {
				// Move up within same category
				return `${cdx}.${Number(rdx) - 1}`;
				// return { cdx, rdx: rdx - 1 };
			} else if (cdx > 0) {
				// Move to last item of previous category
				const prevCdx = Number(cdx) - 1;
				const lastRdx = getLastRowIndex(prevCdx);
				return `${prevCdx}.${lastRdx}`;
				// return { cdx: prevCdx, rdx: lastRdx };
			} else {
				// Already at top, stay there
				return `${cdx}.${rdx}`;
				// return { cdx: 0, rdx: 0 };
			}
		},
		[getLastRowIndex]
	);

	const navigateDown = useCallback(
		(currentCoords) => {
			if (typeof currentCoords !== "object" || currentCoords === null)
				return;

			const { cdx, rdx } = currentCoords;

			if (rdx < getLastRowIndex(cdx)) {
				// Move down within same category
				return `${cdx}.${Number(rdx) + 1}`;
				// return { cdx, rdx: rdx + 1 };
			} else if (cdx < navigableItemsMatrix.length - 1) {
				// Move to first item of next category
				return `${Number(cdx) + 1}.0`;
				// return { cdx: cdx + 1, rdx: 0 };
			} else {
				// Already at bottom, stay there
				return `${cdx}.${rdx}`;
				// return { cdx, rdx };
			}
		},
		[getLastRowIndex, navigableItemsMatrix.length]
	);

	const focusItem = useCallback(
		(itemIdx) => {
			if (!containerRef.current) return;
			requestAnimationFrame(() => {
				const item = containerRef.current.querySelector(
					`.sp-row[data-item-idx="${itemIdx}"] .focusable`
				);
				item.focus();
			});
		},
		[containerRef.current]
	);

	const handleFocus = useCallback((itemIdx) => {
		setFocusedItem(itemIdx);
	}, []);

	const isItemFocused = useCallback(
		(itemIdx) => {
			return focusedItem === itemIdx;
		},
		[focusedItem]
	);

	// Handle keyboard events to navigate focus between rows/items
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		function handleKeyDown(e) {
			// If ArrowDown or ArrowUp navigate focus accordingly
			if (e.keyCode === 40 || e.keyCode === 38) {
				e.preventDefault();
				console.log("up/down");
				let idx;
				setFocusedItem((prev) => {
					const prevCoords = getCoordsByItem(prev);
					const newItem =
						e.keyCode === 40
							? navigateDown(prevCoords)
							: navigateUp(prevCoords);
					idx = newItem;
					return newItem;
				});
				focusItem(idx);
			}

			// On Escape, blur (unfocus) what is currently focused
			if (e.key === "Escape" || e.keyCode === 27) {
				document?.activeElement?.blur();
			}
		}

		container.addEventListener("keydown", handleKeyDown);
		return () => {
			if (container) {
				container.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [navigateDown, navigateUp, setFocusedItem, focusItem]);

	const value = useMemo(
		() => ({
			handleFocus,
			focusItem,
			setFocusedItem,
		}),
		[handleFocus, focusItem, setFocusedItem]
	);

	return (
		<FocusContext.Provider value={value}>{children}</FocusContext.Provider>
	);
}
