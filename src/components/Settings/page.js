import { useMemo, useRef } from "react";
import useSettingsStore from "../../store/settingsStore";
import FocusNavigation from "./Focus/Navigation";
import SettingsItem from "./ui/SettingsItem";
import CategoryTitle from "./ui/CategoryTitle";

export default function Settings() {
	const bodyRef = useRef(null);

	const groupByHierarchy = useSettingsStore(
		(state) => state.groupByHierarchy
	);

	const categories = useMemo(() => {
		return groupByHierarchy();
	}, [groupByHierarchy]);

	return (
		<FocusNavigation categories={categories} containerRef={bodyRef}>
			<div className="sp" role="main">
				<div className="settings-header"></div>

				<div ref={bodyRef} className="sp-body">
					{Object.entries(categories).map(
						([title, category], cdx) => (
							<div
								key={`category.${title}`}
								role="group"
								data-idx={cdx}
							>
								<CategoryTitle itemIdx={`${cdx}.0`}>
									{title}
								</CategoryTitle>
								{Object.entries(category).map(
									([key, item], rdx) => (
										<SettingsItem
											key={key}
											item={item}
											itemKey={`${key}`}
											itemIdx={`${cdx}.${rdx + 1}`}
											fullNavigation={false}
										/>
									)
								)}
							</div>
						)
					)}
				</div>
			</div>
		</FocusNavigation>
	);
}
