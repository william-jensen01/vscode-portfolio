import { useMemo, useRef, useState, useEffect } from "react";
import useSettingsStore from "../../store/settingsStore";
import FocusNavigation from "./Focus/Navigation";
import Focusable from "./Focus/Focusable";
import SettingsItem from "./ui/SettingsItem";
import CategoryTitle from "./ui/CategoryTitle";

export default function Settings() {
	const bodyRef = useRef(null);

	const settingsState = useSettingsStore();

	const [searchQuery, setSearchQuery] = useState();
	const [searchResults, setSearchResults] = useState();
	const searchTimeoutRef = useRef(null);

	const categories = useMemo(
		() => {
			return settingsState.groupByHierarchy();
		},
		// Not including groupByHierarchy in deps as it is persistent and we need to update it whenever a setting is changed
		[settingsState]
	);

	useEffect(() => {
		clearTimeout(searchTimeoutRef.current);

		if (!searchQuery) {
			setSearchResults(null);
			return;
		}

		searchTimeoutRef.current = setTimeout(() => {
			console.log("search timeout");
			setSearchResults(settingsState.searchSettings(searchQuery));
		}, 250);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchQuery, settingsState]);

	const isValidContent =
		!searchResults || (searchResults && searchResults.length > 0);

	const hasSearchResults = searchResults && searchResults.length > 0;
	return (
		<FocusNavigation categories={categories} containerRef={bodyRef}>
			<div
				className={`sp ${
					searchResults && searchResults.length === 0
						? "no-results"
						: ""
				}`}
				role="main"
			>
				<div className="settings-header">
					<HeaderSearch
						setSearchQuery={setSearchQuery}
						searchResults={searchResults}
					/>
					<HeaderControls />
				</div>

				<div ref={bodyRef} className="sp-body" tabIndex={0}>
					<div className="no-results-message">No Settings Found</div>

					{isValidContent && (
						<div className="sp-items">
							{hasSearchResults &&
								searchResults.map((item) => (
									<SettingsItem
										key={item.key}
										item={item}
										itemKey={item.key}
										fullNavigation={true}
									/>
								))}

							{!hasSearchResults &&
								Object.entries(categories).map(
									([title, category], cdx) => (
										<div
											key={`category.${title}`}
											role="group"
											data-idx={cdx}
										>
											<CategoryTitle itemIdx={`${cdx}.0`}>
												{title}
											</CategoryTitle>
											{Object.entries(category).map(
												([key, item], rdx) => (
													<SettingsItem
														key={key}
														item={item}
														itemKey={`${key}`}
														itemIdx={`${cdx}.${
															rdx + 1
														}`}
														fullNavigation={false}
													/>
												)
											)}
										</div>
									)
								)}
						</div>
					)}
				</div>
			</div>
		</FocusNavigation>
	);
}

function HeaderSearch({ setSearchQuery, searchResults }) {
	return (
		<div className="sp-search-container">
			<Focusable itemKey="search-input">
				<input
					className="sp-suggest-input-container"
					type="text"
					placeholder="Search settings"
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
				/>
			</Focusable>
			<div className="sp-count-widget">
				{searchResults &&
					`${
						searchResults.length === 0 ? "No" : searchResults.length
					} Settings Found`}
			</div>
			<div className="sp-clear-widget">
				<ul className="sp-actions-container">
					<li className="sp-action-item"></li>
					<li className="sp-action-item"></li>
				</ul>
			</div>
		</div>
	);
}

function HeaderControls() {
	const [activeTab, setActiveTab] = useState(0);
	const tabs = ["user", "workspace"];
	const clearAndResetSettings = useSettingsStore(
		(state) => state.clearAndResetSettings
	);
	return (
		<div className="sp-header-controls">
			<div className="sp-target-container">
				<div className="sp-tabs-widget">
					<div className="sp-action-bar">
						<ul
							className="sp-actions-container"
							aria-label="Settings Switcher"
						>
							{tabs.map((tab, idx) => (
								<li
									key={`switcher-tab-${idx}`}
									className="sp-action-item"
									role="presentation"
								>
									<a
										className={`sp-action-label ${
											activeTab === idx ? "checked" : ""
										}`}
										role="tab"
										aria-selected={idx === activeTab}
										aria-label={tab}
										onClick={() => setActiveTab(idx)}
										tabIndex={0}
									>
										{tab}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="sp-right-controls">
				<div className="turn-on-sync">
					<Focusable itemKey="turn-on-sync">
						<button onClick={() => clearAndResetSettings()}>
							Clear and Reset Settings
						</button>
					</Focusable>
				</div>
			</div>
		</div>
	);
}
