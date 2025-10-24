import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import Focusable from "../Focus/Focusable";
import useSettingsStore from "../../../store/settingsStore";

export default function HeaderSearch() {
	const {
		searchQuery,
		setSearchQuery,
		searchResults,
		updateSearchState,
		searchSettings,
	} = useSettingsStore(
		useShallow((state) => ({
			searchQuery: state.searchQuery,
			setSearchQuery: state.setSearchQuery,
			searchResults: state.searchResults,
			updateSearchState: state.updateSearchState,
			searchSettings: state.searchSettings,
		}))
	);

	const searchTimeoutRef = useRef(null);

	useEffect(() => {
		clearTimeout(searchTimeoutRef.current);

		if (!searchQuery) {
			updateSearchState(null);
			return;
		}

		searchTimeoutRef.current = setTimeout(() => {
			updateSearchState(searchQuery, searchSettings(searchQuery));
		}, 250);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchQuery, searchSettings, updateSearchState]);

	return (
		<div className="sp-search-container">
			<Focusable itemKey="search-input">
				<input
					className="sp-suggest-input-container"
					type="text"
					placeholder="Search settings"
					value={searchQuery || ""}
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
