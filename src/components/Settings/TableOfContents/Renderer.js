import { useShallow } from "zustand/react/shallow";
import useTableOfContentsStore from "./store";

export default function ToC({
	isSearchResults,
	selectedCategory,
	setSelectedCategory,
}) {
	const { collapsedState, toggleCollapsed, flattenedItems } =
		useTableOfContentsStore(
			useShallow((state) => ({
				collapsedState: state.collapsedState,
				toggleCollapsed: state.toggleCollapsed,
				flattenedItems: state.flattened,
			}))
		);

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
	const isHighlighted = selectedCategory === category.id;
	const isCollapsed = collapsedState[category.parentId];
	const hasSubcategories = category?.subcategories?.length > 0;
	const itemCount = category.count;

	const handleClick = (e) => {
		e.stopPropagation();

		if (hasSubcategories) {
			toggleCollapsed(category.id);
		}

		const title = document.querySelector(
			`.sp-items .sp-group-title[data-category="${category.fullPath}"]`
		);
		title?.scrollIntoView({
			behavior: "smooth",
		});

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
