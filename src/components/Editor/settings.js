import lineCountSettings from "./Features/LineCount/settings";

export const allEditorSettings = [...lineCountSettings].reduce(
	(acc, setting) => {
		return {
			...acc,
			[setting.key]: setting,
		};
	},
	{}
);
