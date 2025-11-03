import { useEffect, useMemo } from "react";
import useTableOfContentsStore from "./store";
import ToC from "./Renderer";
import {
	generateTableOfContents,
	filterByCategoryParts,
	generateItemTree,
	convertTreeToStructureMap,
	sortStructureToOrder,
	createNavigationMatrix,
} from "./generator";

export function useTableOfContents(items, hasSearchResults, selectedCategory) {
	const setState = useTableOfContentsStore((state) => state.setState);

	const toc = useMemo(() => generateTableOfContents(items), [items]);

	const viewableItems = useMemo(() => {
		if (hasSearchResults && selectedCategory) {
			const filteredItems = items.filter((item) =>
				filterByCategoryParts(item.category, selectedCategory)
			);
			const tree = generateItemTree(filteredItems);
			const { lookupMap } = convertTreeToStructureMap(tree);
			return sortStructureToOrder(lookupMap);
		}
		return toc.ordered;
	}, [items, toc, hasSearchResults, selectedCategory]);

	const navigationMatrix = useMemo(() => {
		return createNavigationMatrix(viewableItems, hasSearchResults);
	}, [viewableItems, hasSearchResults]);

	useEffect(() => {
		setState(toc, hasSearchResults);
	}, [setState, toc, hasSearchResults]);

	const value = useMemo(
		() => ({
			toc,
			ToCRenderer: ToC,
			viewable: viewableItems,
			navigationMatrix,
		}),
		[toc, viewableItems, ToC, navigationMatrix]
	);

	return value;
}
