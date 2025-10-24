import Focusable from "../Focus/Focusable";
import FocusRow from "../Focus/Row";

export default function CategoryTitle({ children, itemIdx, category }) {
	return (
		<FocusRow itemIdx={itemIdx}>
			<div
				className="sp-group-title"
				data-item-idx={itemIdx}
				data-category={category.fullPath}
			>
				<Focusable itemKey={`title.${children}`} itemIdx={itemIdx}>
					<h2 className="group-title-label sp-row-inner-container">
						{children}
					</h2>
				</Focusable>
			</div>
		</FocusRow>
	);
}
