import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useTableOfContentsStore from "./store";
import { useStickyStore } from "../Sticky/store";
import { iterateCategoryPaths } from "./generator";

export default function ToC({
	isSearchResults,
	selectedCategory,
	setSelectedCategory,
}) {
	const {
		collapsedState,
		setCollapsedState,
		toggleCollapsed,
		flattenedItems,
	} = useTableOfContentsStore(
		useShallow((state) => ({
			collapsedState: state.collapsedState,
			setCollapsedState: state.setCollapsedState,
			toggleCollapsed: state.toggleCollapsed,
			flattenedItems: state.flattened,
		}))
	);

	const latestHeading = useStickyStore((state) => state.latestHeading);

	// Uncollapse/expand every path in the latest category
	useEffect(() => {
		if (!latestHeading) return;

		setCollapsedState((prev) => {
			const newState = { ...prev };
			iterateCategoryPaths(latestHeading.id, (currentPath) => {
				newState[currentPath] = false;
			});
			return newState;
		});
	}, [latestHeading]);

	return (
		<div
			className="sp-toc-container"
			onClick={(e) => {
				setSelectedCategory("");
			}}
		>
			<div className="sp-toc-wrapper">
				{flattenedItems.map((c) => (
					<CategoryItem
						key={c.id}
						category={c}
						collapsedState={collapsedState}
						toggleCollapsed={toggleCollapsed}
						isSearchResults={isSearchResults}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
					/>
				))}
			</div>
		</div>
	);
}

function CategoryItem({
	category,
	collapsedState,
	toggleCollapsed,
	isSearchResults,
	selectedCategory,
	setSelectedCategory,
}) {
	const latestHeading = useStickyStore((state) => state.latestHeading);
	const isHighlighted =
		selectedCategory === category.id ||
		(!isSearchResults && latestHeading?.id === category.id);
	const isCollapsed = collapsedState[category.parentId];
	const hasSubcategories = category?.subcategories?.length > 0;
	const itemCount = category.count;

	const handleClick = (e) => {
		e.stopPropagation();

		if (hasSubcategories) {
			toggleCollapsed(category.id);
		}

		// Scroll the category title into view
		if (!isSearchResults) {
			const title = document.querySelector(
				`.sp-items .sp-group-title[data-category="${category.fullPath}"]`
			);
			if (!title) return;
			title.scrollIntoView({
				behavior: "smooth",
			});
		}
		// Reset the scroll position
		else {
			const items = document.querySelector(".sp-items");
			if (!items) return;
			items.scrollTop = 0;
		}

		setSelectedCategory(category.id);
	};
	return (
		<div
			key={category.id}
			className={`toc-row ${isHighlighted ? "selected" : ""} ${
				isCollapsed ? "collapsed" : ""
			}`}
			onClick={handleClick}
		>
			<div
				className={`sp-twistie`}
				style={{
					paddingLeft: `calc(${category.level} * 8px)`,
				}}
			>
				{hasSubcategories && (
					<div
						className={`arrow ${
							collapsedState[category.id] ? "close" : ""
						}`}
					/>
				)}
			</div>
			<div className="contents">
				<div className="sp-toc-entry">{category.title}</div>
				<div className="sp-toc-count">
					{isSearchResults && itemCount && `(${itemCount})`}
				</div>
			</div>
		</div>
	);
}
