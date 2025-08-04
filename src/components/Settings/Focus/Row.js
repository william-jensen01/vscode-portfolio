import { useContext } from "react";
import { FocusContext } from "./Navigation";

export default function Row({ itemIdx, children }) {
	const { isItemFocused, setFocusedItem } = useContext(FocusContext);
	return (
		<div
			className={`sp-row ${isItemFocused(itemIdx) ? "focused" : ""}`}
			data-item-idx={itemIdx}
			onClick={(e) => {
				console.log("clicked row", itemIdx);
				setFocusedItem(itemIdx);
			}}
		>
			{children}
		</div>
	);
}
