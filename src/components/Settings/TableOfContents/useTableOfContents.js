import { useEffect, useMemo } from "react";
import useTableOfContentsStore from "./store";
import ToC from "./Renderer";
import { generateTableOfContents } from "./generator";

export function useTableOfContents(items, hasSearchResults) {
	const setState = useTableOfContentsStore((state) => state.setState);

	const toc = useMemo(() => generateTableOfContents(items), [items]);

	useEffect(() => {
		setState(toc, hasSearchResults);
	}, [setState, toc, hasSearchResults]);

	return {
		items: toc,
		ToCRenderer: ToC,
	};
}
