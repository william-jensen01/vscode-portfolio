import lineCountSettings from "./Features/LineCount/settings";
import bracketPairColorizationSettings from "./Features/BracketPairColorization/settings";

const editorSettings = [
	{
		key: "indentationGuides",
		version: 1,
		default: true,
		value: true, // true | false
		input: "checkbox",
		description: "Controls whether the editor should render indent guides.",
		navigation: "editor.guides.indentation",
		data_attribute: "indentation-guides",
		category: "editor.layout",
		migrations: {},
	},
	{
		key: "indentation",
		version: 1,
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
		category: "editor.indentation",
		capitalize: false,
		migrations: {},
	},
	{
		key: "highlightActiveIndentation",
		version: 1,
		default: 1,
		value: null,
		options: [
			{
				value: "true",
				description: "Highlights the active indent guide.",
			},
			{
				value: "always",
				description:
					"Highlights the active indent guide even if bracket guides are highlighted.",
			},
			{
				value: "false",
				description: "Do not highlight the active indent guides.",
			},
		],
		input: "select",
		description:
			"Controls whether the editor should highlight the active indent guide (the left bar).",
		navigation: "editor.guides.highlightActiveIndentation",
		data_attribute: "highlight-active-indentation",
		category: "editor.layout",
		capitalize: false,
		migrations: {},
	},
	{
		key: "renderWhitespace",
		version: 1,
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
		category: "editor.layout",
		capitalize: false,
		migrations: {},
	},
	{
		key: "tabSize",
		version: 1,
		default: 4,
		value: null,
		input: "number",
		description: "The number of spaces a tab is equal to.",
		navigation: "editor.tabSize",
		data_attribute: "tab-size",
		category: "editor.indentation",
		min: 1,
		max: 10,
		migrations: {},
	},
	{
		key: "mobileTabSize",
		version: 1,
		default: 2,
		value: null,
		input: "number",
		description:
			"The number of spaces a tab is equal to when on a mobile device. Mobile is considered screen size <= 600px.",
		navigation: "editor.mobileTabSize",
		data_attribute: "mobile-tab-size",
		category: "editor.indentation",
		min: 1,
		max: 10,
		migrations: {},
	},
	{
		key: "fontSize",
		version: 1,
		default: 14,
		value: null,
		input: "number",
		unit: "px",
		description: "Controls the font size in pixels.",
		navigation: "editor.fontSize",
		data_attribute: "editor-font-size",
		category: "editor.text",
		min: 6,
		max: 100,
		migrations: {},
	},
	{
		key: "lineHeight",
		version: 1,
		default: 0,
		value: 0,
		input: "number",
		markdown: `
			<p>Controls the line height.</p>

			<ul>
			<li>Use 0 to automatically compute the line height from the font size.</li>
			<li>Values between 0 and 8 will be used as a multiplier with the font size.</li>
			<li>Values greater than or equal to 8 will be used as effective values.</li>
			</ul>
		`,
		navigation: "editor.lineHeight",
		data_attribute: "editor-line-height",
		category: "editor.text",
		min: 0,
		max: 1000,
		migrations: {},
	},
	{
		key: "wordWrap",
		version: 1,
		default: 1,
		value: null,
		options: [
			{
				value: "off",
				description: "Lines will never wrap.",
			},
			{
				value: "on",
				description: "Lines will wrap at the viewport width.",
			},
		],
		input: "select",
		description: "Controls how lines should wrap.",
		navigation: "editor.wordWrap",
		data_attribute: "word-wrap",
		category: "editor.text",
		migrations: {},
	},
];

export const allEditorSettings = [
	...editorSettings,
	...lineCountSettings,
	...bracketPairColorizationSettings,
];
