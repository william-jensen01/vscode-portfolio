import { useMemo } from "react";

import { useStickyStore } from "./store";
import FocusRow from "../Focus/Row";

function DummyTitle({ cKey, value, idx }) {
	return (
		<div className="list-row" data-level={value?.header?.level}>
			<FocusRow itemIdx={`${idx}.0`} ignoreFocus={true}>
				<div className="sp-group-title" data-item-idx={idx}>
					<h2
						className={`group-title-label sp-row-inner-container level-${value?.header?.level}`}
					>
						{value?.header?.title}
					</h2>
				</div>
			</FocusRow>
		</div>
	);
}

export default function StickyWidget({ disabled }) {
	const stickyHeaders = useStickyStore((state) => state.stickyHeaders);

	const items = useMemo(() => {
		return Array.from(stickyHeaders.entries())
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([key, value]) => (
				<DummyTitle key={key} cKey={key} value={value} idx={key} />
			));
	}, [stickyHeaders]);

	return (
		<div className="sticky-container">
			<div className="sticky-items">{!disabled && items}</div>
		</div>
	);
}
