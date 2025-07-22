export default [
	{
		key: "lineNumbers",
		version: 1,
		default: 1,
		value: null, // will be set to options[default]
		options: [
			{
				value: "off",
				description: "Line numbers are not rendered.",
			},
			{
				value: "on",
				description: "Line numbers are rendered as absolute numbers.",
			},
			{
				value: "relative",
				description:
					"Line numbers are rendered as distance in lines to cursor position.",
			},
			{
				value: "interval",
				description: "Line numbers are rendered every 10 lines",
			},
		],
		input: "select",
		description: "Controls the display of line numbers.",
		navigation: "editor.lineNumbers",
		data_attribute: "line-numbers",
		category: "editor",
		capitalize: false,
		migrations: {},
	},
];
