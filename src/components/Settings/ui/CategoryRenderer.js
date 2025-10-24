import CategoryTitle from "./CategoryTitle";
import SettingsItem from "./SettingsItem";

export default function CategoryRenderer({ category, categoryIndex }) {
	const isCollapsed = false;
	const hasSettings = category.settings?.length > 0;
	const hasSubcategories = category.subcategories?.length > 0;

	return (
		<div
			key={category.id}
			className={`sp-category-container level-${category.level}`}
		>
			<CategoryTitle
				key={category.id}
				itemIdx={`${categoryIndex}.0`}
				category={category}
			>
				{category.title}
			</CategoryTitle>

			{!isCollapsed &&
				hasSettings &&
				category.settings.map((setting, idx) => (
					<SettingsItem
						key={setting.navigation}
						name={setting.key}
						itemKey={`${setting.key}`}
						itemIdx={`${categoryIndex}.${idx + 1}`}
						fullNavigation={false}
					/>
				))}

			{!isCollapsed &&
				hasSubcategories &&
				category.subcategories.map((subcategory, subIdx) => (
					<CategoryRenderer
						key={subcategory.id}
						category={subcategory}
						// categoryIndex={category.headerCountBefore + subIdx + 1}
						categoryIndex={subcategory.navigationIndex}
					/>
				))}
		</div>
	);
}
