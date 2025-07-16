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
	{
		key: "indentation",
		default: 1,
		value: null,
		options: [
			{
				value: "spaces",
				description:
					"Indentation will use spaces. The number is configurable in the 'tabSize' setting.",
			},
			{
				value: "tab",
				description:
					"Indentation will use tabs. A tab is equal to the width of 'tabSize' spaces.",
			},
		],
		input: "select",
		description:
			"Controls whether the editor should render tabs or spaces for indent.",
		navigation: "editor.indentation",
		data_attribute: "indentation",
		category: "editor",
		capitalize: false,
	},
	{
		key: "renderWhitespace",
		default: 2,
		value: null,
		options: [
			{
				value: "none",
				description: "",
			},
			{
				value: "boundary",
				description:
					"Render whitespace characters except for single spaces between words.",
			},
			{
				value: "selection",
				description:
					"Render whitespace characters only on selected text.",
			},
			{
				value: "all",
				description: "",
			},
		],
		input: "select",
		description:
			'Controls how the editor should render whitespace characters, "all", "none", or "selection"',
		navigation: "editor.renderWhitespace",
		data_attribute: "render-whitespace",
		category: "editor",
		capitalize: false,
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
