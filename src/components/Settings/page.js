import { useMemo, useRef, useState, useCallback } from "react";
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

	const [selectedCategory, setSelectedCategory] = useState("");

	const { getAllSettings, searchResults, forceRestart } = useSettingsStore(
		useShallow((state) => ({
			getAllSettings: state.getAllSettings,
			searchResults: state.searchResults,
			forceRestart: state.forceRestart,
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

	const { toc, ToCRenderer, viewable, navigationMatrix } = useTableOfContents(
		items,
		hasSearchResults,
		selectedCategory
	);

	// Force sticky header recreation when viewable list changes or on forceRestart
	const stickyHeaderStoreKey = useMemo(() => {
		return `sticky-store-${viewable.length}-${Date.now()}`;
	}, [viewable, forceRestart]);

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
							<div className="split-view-container">
								<div className="split-view-view">
									<ToCRenderer
										isSearchResults={hasSearchResults}
										selectedCategory={selectedCategory}
										setSelectedCategory={
											setSelectedCategory
										}
									/>
								</div>

								<div className="sash-container">
									<div className="sash vertical" />
								</div>

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
