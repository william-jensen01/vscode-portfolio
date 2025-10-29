export const ORDER = [
	"editor",
	"editor.cursor",
	"editor.find",
	"editor.font",
	"editor.formatting",
	"editor.diff",
	"editor.minimap",
	"editor.suggestions",
	"editor.files",
	"workbench",
	"workbench.appearance",
	"workbench.breadcrumbs",
	"workbench.editorManagement",
	"workbench.settingsEditor",
];

// Reduces all category paths and invokes the callback for each
export function iterateCategoryPaths(category, callback) {
	const parts = category.split(".");
	parts.reduce((acc, part, idx) => {
		const currentPath = idx === 0 ? part : `${acc}.${part}`;
		callback(currentPath, part, idx);
		return currentPath;
	}, "");
	return parts;
}

export function filterByCategoryParts(category, filteredCategory) {
	const paths = new Set();
	iterateCategoryPaths(category, (currentPath) => paths.add(currentPath));
	return paths.has(filteredCategory);
}

// Build dynamic order by appending unknown categories to their parent sections
function buildDynamicOrder(lookupMap) {
	const dynamicOrder = [...ORDER];
	const orderedIds = new Set(ORDER);
	const allCategoryIds = Array.from(lookupMap.keys());

	// Find categories not in ORDER
	const unknownCategories = allCategoryIds.filter(
		(id) => !orderedIds.has(id)
	);

	// Group unknown categories by their parent
	const unknownByParent = {};
	unknownCategories.forEach((id) => {
		const parts = id.split(".");
		if (parts.length > 1) {
			const parentId = parts.slice(0, -1).join(".");
			if (!unknownByParent[parentId]) {
				unknownByParent[parentId] = [];
			}
			unknownByParent[parentId].push(id);
		}
	});

	// Insert unknown categories after their parent's last occurrence in ORDER
	const finalOrder = [];
	dynamicOrder.forEach((orderedId) => {
		finalOrder.push(orderedId);
		if (unknownByParent[orderedId]) {
			finalOrder.push(...unknownByParent[orderedId]);
		}
	});

	// Add any root-level unknown categories at the end
	unknownCategories.forEach((id) => {
		const parts = id.split(".");
		if (parts.length === 1 && !finalOrder.includes(id)) {
			finalOrder.push(id);
		}
	});

	return finalOrder;
}

// Extract categories and subcategories from items to create a table of contents
export function generateTableOfContents(items) {
	const categoryTree = generateItemTree(items);

	// Convert tree to ToC structure and build lookup map
	const { structure, lookupMap } = convertTreeToStructureMap(categoryTree);

	const orderedStructure = sortStructureToOrder(lookupMap);

	const flattenedStructure = flattenTocStructure(orderedStructure);

	const result = {
		flattened: flattenedStructure,
		ordered: orderedStructure,
		tree: categoryTree,
		lookupMap,
		structure,
	};

	console.log("generateTableOfContents :: result:", result);

	return result;
}

export function generateItemTree(items) {
	// Convert to array if needed
	const settingsArray = Array.isArray(items) ? items : Object.values(items);

	const categoryCounts = {};
	const categorySettings = {}; // Group settings by category

	settingsArray.forEach((setting) => {
		const category = setting.category;

		iterateCategoryPaths(category, (currentPath) => {
			categoryCounts[currentPath] =
				(categoryCounts[currentPath] || 0) + 1;
		});

		// Group settings by category
		if (!categorySettings[category]) {
			categorySettings[category] = [];
		}
		categorySettings[category].push(setting);
	});

	const categoryTree = {};

	// Build tree in a single pass
	Object.keys(categorySettings).forEach((category) => {
		let currentLevel = categoryTree;

		iterateCategoryPaths(category, (currentPath, part, index) => {
			if (!currentLevel[part]) {
				currentLevel[part] = {
					name: part,
					fullPath: currentPath,
					level: index + 1,
					count: categoryCounts[currentPath] || 0,
					settings: categorySettings[currentPath] || [],
					children: {},
				};
			}

			currentLevel = currentLevel[part].children;
		});
	});

	return categoryTree;
}

// Recursively convert tree structure to ToC structure and build lookup map
export function convertTreeToStructureMap(tree, parentId) {
	const lookupMap = new Map();

	const convert = (tree, parentId) => {
		return Object.values(tree).map((node) => {
			const item = {
				id: node.fullPath,
				title: formatCategoryTitle(node.name),
				level: node.level,
				fullPath: node.fullPath,
				count: node.count,
				settings: node.settings,
				subcategories: convert(node.children, node.fullPath),
				parentId,
			};

			lookupMap.set(node.fullPath, item);
			return item;
		});
	};

	const structure = convert(tree, parentId);
	return { structure, lookupMap };
}

// Flatten the hierarchical structure into a single array for easier rendering
export function flattenTocStructure(orderedStructure, parent = {}) {
	const flatList = [];
	const { parentId, parentIndex } = parent;

	orderedStructure.forEach((category, index) => {
		// Add current category
		const structure = {
			id: category.id,
			title: category.title,
			level: category.level,
			fullPath: category.fullPath,
			count: category.count,
			subcategories: category.subcategories,
			...category,
			parentId,
			index,
			parentIndex,
		};

		flatList.push(structure);

		// Recursively add subcategories
		if (category.subcategories && category.subcategories.length > 0) {
			const subItems = flattenTocStructure(category.subcategories, {
				parentId: category.id,
				parentIndex: index,
			});
			flatList.push(...subItems);
		}
	});

	return flatList;
}

// Build ordered structure using lookup map while filtering subcategories
export function sortStructureToOrder(lookupMap) {
	const dynamicOrder = buildDynamicOrder(lookupMap);
	const childIds = new Set();

	dynamicOrder.forEach((c) => {
		const item = lookupMap.get(c);
		if (item?.subcategories?.length > 0) {
			item.subcategories.forEach((sub) => childIds.add(sub.id));
		}
	});

	const orderedStructure = dynamicOrder
		.map((c) => lookupMap.get(c))
		.filter(Boolean)
		.filter((item) => !childIds.has(item.id));

	return orderedStructure;
}

export function createNavigationMatrix(structure, isSearchResults) {
	const matrix = [];
	let navigationIndex = 0;

	const addToMatrix = (category) => {
		category.navigationIndex = navigationIndex++;

		// matrix.push([`title:${category.id}`, ...category.settings]);

		// matrix.push(
		// 	isSearchResults
		// 		? [...category.settings]
		// 		: [`title:${category.id}`, ...category.settings]
		// );

		const items = [];
		if (!isSearchResults) {
			items.push(`title:${category.id}`);
		}
		items.push(...category.settings);
		if (items.length > 0) {
			matrix.push(items);
		}

		if (category?.subcategories && category.subcategories.length > 0) {
			category.subcategories.forEach((subcat) => {
				addToMatrix(subcat);
			});
		}
	};

	structure.forEach((category) => {
		addToMatrix(category);
	});

	return matrix;
}

function formatCategoryTitle(name) {
	// Handle camelCase by adding spaces before capital letters
	const spaced = name.replace(/([A-Z])/g, " $1");
	// Capitalize first letter
	return spaced
		.split(" ")
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join(" ");
}
