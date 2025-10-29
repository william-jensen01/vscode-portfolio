import { useRef, useContext, useLayoutEffect } from "react";
import { CategoryContext } from "./CategoryRenderer";
import { useStickyStore } from "../Sticky/store";
import Focusable from "../Focus/Focusable";
import FocusRow from "../Focus/Row";

export default function CategoryTitle({ children, itemIdx, category }) {
	const { categoryId: parentCategoryId, registered: categoryRegistered } =
		useContext(CategoryContext);

	const registerHeader = useStickyStore((state) => state.registerHeader);

	const ref = useRef(null);
	const titleRef = useRef(null);

	useLayoutEffect(() => {
		const title = titleRef.current;
		if (!categoryRegistered || !title) return;

		registerHeader(parentCategoryId, {
			categoryId: parentCategoryId,
			element: title,
			title: children,
			level: category.level,
		});
	}, [registerHeader, categoryRegistered]);
	return (
		<div ref={ref} className="list-row" data-level={category.level}>
			<FocusRow itemIdx={itemIdx}>
				<div
					ref={titleRef}
					className="sp-group-title"
					data-item-idx={itemIdx}
					data-category={category.fullPath}
				>
					<Focusable itemKey={`title.${children}`} itemIdx={itemIdx}>
						<h2
							className={`group-title-label sp-row-inner-container level-${category.level}`}
						>
							{children}
						</h2>
					</Focusable>
				</div>
			</FocusRow>
		</div>
	);
}
