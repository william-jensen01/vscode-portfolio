import React, { cloneElement, useContext } from "react";
import { FocusContext } from "./Navigation";

export default function Focusable({ children, itemKey, itemIdx, ...props }) {
	const { handleFocus: handleFocusState } = useContext(FocusContext);

	return React.Children.map(children, (child, idx) => {
		if (!child) return;
		const combinedClassName = [child.props.className || "", "focusable"]
			.join(" ")
			.trim();

		const handleFocus = (e) => {
			handleFocusState(itemIdx);

			if (typeof child.props.onFocus === "function") {
				child.props.onFocus(e);
			}
		};

		const handleClick = (e) => {
			handleFocusState(itemIdx);

			if (typeof child.props.onClick === "function") {
				child.props.onClick(e);
			}
		};

		return cloneElement(child, {
			...child.props,
			key: `focusable-${itemKey}.${idx}`,
			className: combinedClassName,
			onFocus: handleFocus,
			onClick: handleClick,
			tabIndex: 0,
			...props,
		});
	});
}
