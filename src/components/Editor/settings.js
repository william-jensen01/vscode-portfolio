import lineCountSettings from "./Features/LineCount/settings";
import bracketPairColorizationSettings from "./Features/BracketPairColorization/settings";

const editorSettings = [
	{
		key: "indentationGuides",
		default: true,
		value: true, // true | false
		input: "checkbox",
		description: "Controls whether the editor should render indent guides.",
		navigation: "editor.guides.indentation",
		data_attribute: "indentation-guides",
		category: "editor",
	},
];

export const allEditorSettings = [
	...editorSettings,
	...lineCountSettings,
	...bracketPairColorizationSettings,
].reduce((acc, setting) => {
	return {
		...acc,
		[setting.key]: setting,
	};
}, {});
