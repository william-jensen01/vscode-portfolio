import React, { useEffect, useRef, useMemo } from "react";
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
import { throttle } from "./hooks/useThrottle";

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

	useEffect(() => {
		const handleSelection = throttle(() => {
			const selection = window.getSelection();

			// Clear previous selections first
			const previouslySelected = document.querySelectorAll(
				`.spacer-tab .gap.selected`
			);
			previouslySelected.forEach((spacer) =>
				spacer.classList.remove("selected")
			);

			if (selection.isCollapsed || selection.rangeCount === 0) return;

			// Process each range in the selection
			for (let i = 0; i < selection.rangeCount; i++) {
				const range = selection.getRangeAt(i);
				let commonAncestor = range.commonAncestorContainer;

				// If text node, get parent element
				if (commonAncestor.nodeType !== Node.ELEMENT_NODE) {
					commonAncestor = commonAncestor.parentElement;
				}

				if (!commonAncestor) return;

				const container =
					commonAncestor.closest(".line") ||
					commonAncestor.closest(".view-lines") ||
					commonAncestor;

				const spacers = container.querySelectorAll(".spacer-tab .gap");

				// Check each spacer against the selection range
				spacers.forEach((spacer) => {
					if (range.intersectsNode(spacer)) {
						spacer.classList.add("selected");
					}
				});
			}
		}, 50);

		function handleDeselect() {
			const spacers = document.querySelectorAll(
				".spacer-tab .gap.selected"
			);
			spacers.forEach((spacer) => {
				spacer.classList.remove("selected");
			});
		}

		document.addEventListener("selectionchange", handleSelection);
		document.addEventListener("mouseup", () => {
			if (window.getSelection().isCollapsed) {
				handleDeselect();
			}
		});
		return () => {
			document.removeEventListener("selectionchange", handleSelection);
			document.removeEventListener("mouseup", () => {
				if (window.getSelection().isCollapsed) {
					handleDeselect();
				}
			});
		};
	}, []);

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
