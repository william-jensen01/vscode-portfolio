import {
	useRef,
	useState,
	createContext,
	useMemo,
	useLayoutEffect,
	useEffect,
} from "react";
import { useStickyStore } from "../Sticky/store";
import CategoryTitle from "./CategoryTitle";
import SettingsItem from "./SettingsItem";
import { useShallow } from "zustand/react/shallow";

export const CategoryContext = createContext({
	registered: false,
	categoryId: null,
});

export default function CategoryRenderer({
	category,
	categoryIndex,
	isSearchResults,
	selectedCategory,
}) {
	const { registerCategory, measureCategory } = useStickyStore(
		useShallow((state) => ({
			registerCategory: state.registerCategory,
			measureCategory: state.measureCategory,
		}))
	);

	const [registered, setRegistered] = useState(false);
	const containerRef = useRef(null);

	const isCollapsed = false;
	const hasSettings = category.settings?.length > 0;
	const hasSubcategories = category.subcategories?.length > 0;

	const value = useMemo(
		() => ({
			registered,
			categoryId: category.id,
		}),
		[registered, category.id]
	);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (registered || !container) return;

		registerCategory(category.id, { element: container });
		setRegistered(true);
	}, [registerCategory, category, registered]);

	useEffect(() => {
		const container = document.querySelector(".sp-items");
		if (!registered || !container || !category?.id) {
			return;
		}

		measureCategory(category.id, container);
	}, [registered, category?.id, measureCategory]);

	const startingIndex = isSearchResults ? 0 : 1;

	return (
		<CategoryContext.Provider value={value}>
			<div
				ref={containerRef}
				key={category.id}
				className={`sp-category-container level-${category.level}`}
			>
				{!isSearchResults && (
					<CategoryTitle
						key={category.id}
						itemIdx={`${categoryIndex}.0`}
						category={category}
					>
						{category.title}
					</CategoryTitle>
				)}

				{!isCollapsed &&
					hasSettings &&
					category.settings.map((setting, idx) => (
						<SettingsItem
							key={setting.navigation}
							name={setting.key}
							itemKey={`${setting.key}`}
							itemIdx={`${categoryIndex}.${startingIndex + idx}`}
							fullNavigation={isSearchResults}
						/>
					))}

				{!isCollapsed &&
					hasSubcategories &&
					category.subcategories.map((subcategory) => (
						<CategoryRenderer
							key={subcategory.id}
							category={subcategory}
							categoryIndex={subcategory.navigationIndex}
							isSearchResults={isSearchResults}
							selectedCategory={selectedCategory}
						/>
					))}
			</div>
		</CategoryContext.Provider>
	);
}
