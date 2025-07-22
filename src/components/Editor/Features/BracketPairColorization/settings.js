export default [
	{
		key: "bracketPairColorization.enabled",
		default: true,
		value: true, // true | false
		input: "checkbox",
		description:
			"Controls whether bracket pair colorization is enabled or not.",
		navigation: "editor.bracketPairColorization.enabled",
		data_attribute: "bracket-pair-colorization",
		category: "editor",
	},
	{
		key: "bracketPairs",
		default: 0,
		value: null,
		options: [
			{
				value: "true",
				description: "Enables bracket pair guides.",
			},
			{
				value: "active",
				description:
					"Enables bracket pair guides only for the active bracket pair.",
			},
			{
				value: "false",
				description: "Disables bracket pair guides.",
			},
		],
		input: "select",
		description:
			"Controls whether the editor should highlight the active indentation guide.",
		navigation: "editor.guides.bracketPairs",
		data_attribute: "bracket-pairs",
		category: "editor",
		capitalize: false,
	},
	{
		key: "highlightActiveBracketPair",
		default: true,
		value: true, // true | false
		input: "checkbox",
		description:
			"Controls whether the editor should highlight the active bracket pair.",
		navigation: "editor.guides.highlightActiveBracketPair",
		data_attribute: "highlight-active-bracket-pair",
		category: "editor",
	},
	{
		key: "bracketPairsHorizontal",
		default: 0,
		value: null,
		options: [
			{
				value: "true",
				description:
					"Enables horizontal guides as addition to vertical bracket pair guides.",
			},
			{
				value: "active",
				description:
					"Enables horizontal guides only for the active bracket pair.",
			},
			{
				value: "false",
				description: "Disables horizontal bracket pair guides.",
			},
		],
		input: "select",
		description:
			"Controls whether the horizontal bracket pair guides are enabled or not (the thin horizontal line)",
		navigation: "editor.guides.bracketPairsHorizontal",
		data_attribute: "bracket-pairs-horizontal",
		category: "editor",
		capitalize: false,
	},
];
