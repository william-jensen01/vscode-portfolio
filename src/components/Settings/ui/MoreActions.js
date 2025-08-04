import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import useSettingsStore from "../../../store/settingsStore";
import Focusable from "../Focus/Focusable";
import sprite from "../../../assets/svgs-sprite.svg";
import React from "react";

export default function MoreActions({ itemKey, itemIdx, item }) {
	const [showActions, setShowActions] = useState(false);
	const [focusedOption, setFocusedOption] = useState();
	const changeSpecificSetting = useSettingsStore(
		(state) => state.changeSpecificSetting
	);
	const moreButtonRef = useRef(null);
	const containerRef = useRef(null);

	const performableActions = useMemo(
		() => [
			{
				type: "action",
				label: "Reset Setting",
				onSelect: () => {
					console.log("reset setting");
					changeSpecificSetting(itemKey, item.default);
				},
			},
			{ type: "separator" },
			{
				type: "action",
				label: "Copy Setting ID",
				onSelect: () => {
					console.log("copy setting id");
					navigator.clipboard.writeText(item.navigation);
				},
			},
			{
				type: "action",
				label: "Copy Setting as JSON",
				onSelect: () => {
					console.log("copy setting as json");
					const key = item.navigation;
					const value =
						item.input === "select"
							? item.options[item.value].value
							: item.value;
					const result = `"${key}": ${JSON.stringify(value)}`;

					navigator.clipboard.writeText(result);
				},
			},
			{
				type: "action",
				label: "Copy Setting URL",
				onSelect: () => {
					console.log("copy setting url");
					navigator.clipboard.writeText(
						`vscode://settings/${item.navigation}`
					);
				},
			},
			{ type: "separator" },
			{
				type: "action",
				label: "Apply Setting to all Profiles",
				onSelect: () => {
					console.log("apply setting to all profiles");
				},
			},
		],
		[changeSpecificSetting, item, itemKey]
	);

	const performAction = useCallback((onSelect) => {
		if (!onSelect) return;
		onSelect();
		setShowActions(false);
		moreButtonRef.current.focus();
	}, []);

	useEffect(() => {
		const moreButton = moreButtonRef.current;
		if (!moreButton) return;

		function handleKeyDown(e) {
			if (e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();

				if (showActions) {
					performAction(performableActions[focusedOption].onSelect);
				}
				setShowActions(!showActions);
			}
			if (e.key === "Tab") {
				if (showActions) {
					// absolutely stop everything
					e.preventDefault();
					e.stopPropagation();
				}
			}
			if (e.key === "ArrowDown" || e.keyCode === 40) {
				if (!showActions) return;
				e.preventDefault();
				e.stopPropagation();

				setFocusedOption((prev) => {
					let nextIdx = Math.min(
						prev >= 0 ? prev + 1 : 0,
						performableActions.length - 1
					);

					const nextOption = performableActions[nextIdx];

					// Skip to next option if it is a separator
					if (!nextOption.onSelect || nextOption.type === "separator")
						nextIdx += 1;

					return nextIdx;
				});
			}
			if (e.key === "ArrowUp" || e.keyCode === 38) {
				if (!showActions) return;
				e.preventDefault();
				e.stopPropagation();

				setFocusedOption((prev) => {
					let nextIdx = Math.max(prev > 0 ? prev - 1 : 0, 0);

					const nextOption = performableActions[nextIdx];

					if (!nextOption.onSelect || nextOption.type === "separator")
						nextIdx -= 1;

					return nextIdx;
				});
			}
		}

		moreButton.addEventListener("keydown", handleKeyDown);

		return () => {
			moreButton.removeEventListener("keydown", handleKeyDown);
		};
	}, [focusedOption, showActions, performableActions, performAction]);

	return (
		<div
			className={`dropdown ${showActions ? "active" : ""}`}
			ref={containerRef}
		>
			<div className="dropdown-label">
				<Focusable itemKey={itemKey} itemIdx={itemIdx}>
					<a
						ref={moreButtonRef}
						className="sp-more-action"
						onClick={(e) => {
							setShowActions((prev) => !prev);
						}}
						onBlur={(e) => {
							setTimeout(() => {
								if (
									!containerRef.current.contains(
										document.activeElement
									)
								) {
									setShowActions(false);
								}
							}, 100);
						}}
					>
						<svg>
							<use href={`${sprite}#icon-settings`} />
						</svg>
					</a>
				</Focusable>
			</div>

			{showActions && (
				<div className="sp-action-bar vertical">
					<ul
						className="sp-actions-container"
						role="menu"
						// tabIndex={0}
					>
						{performableActions.map(
							({ type, label, onSelect }, idx) => {
								const isAction = type === "action";
								return (
									<li
										key={`${itemKey}.action.${idx}`}
										className={`sp-action-item ${
											!isAction ? "disabled" : ""
										} ${
											focusedOption === idx
												? "focused"
												: ""
										}`}
										role="presentation"
										onClick={(e) => {
											performAction(onSelect);
										}}
										onMouseEnter={(e) => {
											setFocusedOption(idx);
										}}
									>
										<a
											className={`${
												isAction
													? "sp-action-menu-item"
													: "sp-action-label-separator"
											}`}
										>
											{isAction && (
												<span className="sp-action-label">
													{label}
												</span>
											)}
										</a>
									</li>
								);
							}
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
