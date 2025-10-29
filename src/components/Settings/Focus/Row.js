import { useContext } from "react";
import { FocusContext } from "./Navigation";

export default function Row({ itemIdx, className, ignoreFocus, children }) {
	const { isItemFocused, setFocusedItem } = useContext(FocusContext);
	return (
		<div
			className={`sp-row ${
				!ignoreFocus && isItemFocused(itemIdx) ? "focused" : ""
			}  ${className ? className : ""}`}
			data-item-idx={itemIdx}
			onClick={(e) => {
				console.log("clicked row", itemIdx);
				if (ignoreFocus) return;
				setFocusedItem(itemIdx);
			}}
		>
			{children}
		</div>
	);
}
