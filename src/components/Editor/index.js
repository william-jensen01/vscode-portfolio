import React, { useRef, useMemo } from "react";
import NewLine from "./Elements/Line";
import {
	useUpdateLineWidth,
	createLineStore,
	LineCountContext,
} from "./Features/LineCount/lineStore";
import {
	createScopeStore,
	ScopeStoreContext,
} from "./Features/Scope/scopeStore";
import {
	createBracketPairColorizerStore,
	BracketPairColorizerContext,
} from "./Features/BracketPairColorization/store";
import StickyManager from "./Features/StickyLines/Manager";
import {
	createStickyLineStore,
	StickyLineContext,
} from "./Features/StickyLines/stickyStore";
import { useFileBoundingRectStoreInstance } from "../../store/fileBoundingRectStore";
import { useGeneratedId } from "./hooks/useGeneratedId";
import { useWhitespaceSelection } from "./Features/Selection/useWhitespaceSelection";

import "../../styles/user-settings.css";

// MARK: Instance

export function EditorInstance({ children }) {
	const editorId = useGeneratedId("editor");
	const viewLinesRef = useRef(null);
	// const lineStore = useRef(createLineStore()).current;
	const lineStore = useMemo(() => createLineStore(), []);
	// const scopeStore = useRef(createScopeStore()).current;
	const scopeStore = useMemo(() => createScopeStore(), []);
	const bracketPairColorizerStore = useMemo(
		() => createBracketPairColorizerStore(),
		[]
	);
	const fileBoundingRectStore = useFileBoundingRectStoreInstance();
	const stickyLineStore = useMemo(
		() => createStickyLineStore(null, fileBoundingRectStore),
		[fileBoundingRectStore]
	);

	useUpdateLineWidth(lineStore);

	useWhitespaceSelection(viewLinesRef);

	return (
		<StickyLineContext.Provider value={stickyLineStore}>
			<BracketPairColorizerContext.Provider
				value={bracketPairColorizerStore}
			>
				<LineCountContext.Provider value={lineStore}>
					<ScopeStoreContext.Provider value={scopeStore}>
						<div className="editor-container" data-id={editorId}>
							<div className="editor-instance">
								<StickyManager />
								<div ref={viewLinesRef} className="view-lines">
									{children}
									<NewLine />
									<NewLine>
										<div id="caret" />
									</NewLine>
								</div>
							</div>
						</div>
					</ScopeStoreContext.Provider>
				</LineCountContext.Provider>
			</BracketPairColorizerContext.Provider>
		</StickyLineContext.Provider>
	);
}
