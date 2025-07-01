import lineCountSettings from "./Features/LineCount/settings";
import bracketPairColorizationSettings from "./Features/BracketPairColorization/settings";

export const allEditorSettings = [
	...lineCountSettings,
	...bracketPairColorizationSettings,
].reduce((acc, setting) => {
	return {
		...acc,
		[setting.key]: setting,
	};
}, {});
