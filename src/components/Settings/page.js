import { useMemo, useRef, useState, useCallback, useLayoutEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useSettingsStore from "../../store/settingsStore";
import FocusNavigation from "./Focus/Navigation";
import HeaderSearch from "./Search";
import Focusable from "./Focus/Focusable";
import { useTableOfContents } from "./TableOfContents/useTableOfContents";
import CategoryRenderer from "./ui/CategoryRenderer";
import StickyManager from "./Sticky/Manager";
import { StickyHeaderProvider } from "./Sticky/store";

export default function Settings() {
	const bodyRef = useRef(null);

	// items callback ref
	const [itemsNode, setItemsNode] = useState(null);
	const setItemsRef = useCallback((node) => {
		setItemsNode(node);
	}, []);

	const [showToC, setShowToC] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("");

	const { getAllSettings, searchResults, forceRestart, searchTocBehavior } =
		useSettingsStore(
			useShallow((state) => ({
				getAllSettings: state.getAllSettings,
				searchResults: state.searchResults,
				forceRestart: state.forceRestart,
				searchTocBehavior: state.searchTocBehavior,
			}))
		);

	const items = useMemo(() => {
		if (!getAllSettings) return [];

		if (searchResults) {
			return searchResults.length > 0 ? searchResults : [];
		} else {
			return getAllSettings({ format: "array" });
		}
	}, [getAllSettings, searchResults]);

	const hasSearchResults = searchResults && searchResults.length > 0;
	const isValidContent =
		!searchResults || (searchResults && searchResults.length > 0);

	const showTocSetting =
		searchTocBehavior.options[searchTocBehavior.value].value === "filter";

	const { toc, ToCRenderer, viewable, navigationMatrix } = useTableOfContents(
		items,
		hasSearchResults,
		selectedCategory
	);

	// Force sticky header recreation when viewable list changes or on forceRestart
	const stickyHeaderStoreKey = useMemo(() => {
		return `sticky-store-${viewable.length}-${Date.now()}`;
	}, [viewable, forceRestart]);

	// Do not render ToC if screen is too small (700px)
	useLayoutEffect(() => {
		const body = bodyRef.current;
		if (!body) return;

		const observer = new ResizeObserver((entries) => {
			if (entries[0].target.offsetWidth <= 700) {
				setShowToC(false);
			} else {
				setShowToC(true);
			}
		});

		observer.observe(body);
		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<FocusNavigation
			containerRef={itemsNode}
			navigableItemsMatrix={navigationMatrix}
		>
			<div
				className={`sp ${
					searchResults && searchResults.length === 0
						? "no-results"
						: ""
				}`}
				role="main"
			>
				<div className="settings-header">
					<HeaderSearch />
					<HeaderControls />
				</div>

				<div ref={bodyRef} className="sp-body" tabIndex={0}>
					<div className="no-results-message">No Settings Found</div>

					{isValidContent && (
						<StickyHeaderProvider key={stickyHeaderStoreKey}>
							<div
								className="split-view-container"
								style={{
									gridTemplateColumns: showToC
										? showTocSetting
											? "200px 1px 1fr"
											: "0px 1fr"
										: "1fr",
								}}
							>
								{showToC && (
									<>
										<div
											className="split-view-view"
											style={{
												width: showTocSetting
													? "200px"
													: "0px",
											}}
										>
											<ToCRenderer
												isSearchResults={
													hasSearchResults
												}
												selectedCategory={
													selectedCategory
												}
												setSelectedCategory={
													setSelectedCategory
												}
											/>
										</div>

										{showTocSetting && (
											<div className="sash-container">
												<div className="sash vertical" />
											</div>
										)}
									</>
								)}

								<div className="split-view-view">
									<div ref={setItemsRef} className="sp-items">
										<StickyManager
											containerRef={itemsNode}
											disabled={hasSearchResults}
										/>

										{viewable.map((category) => (
											<CategoryRenderer
												key={category.id}
												category={category}
												categoryIndex={
													category.navigationIndex
												}
												isSearchResults={
													hasSearchResults
												}
												selectedCategory={
													selectedCategory
												}
											/>
										))}
									</div>
								</div>
							</div>
						</StickyHeaderProvider>
					)}
				</div>
			</div>
		</FocusNavigation>
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
