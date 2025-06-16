import React, { useEffect, useRef, useMemo, useState } from "react";
import { useGeneratedId } from "../../hooks/useGeneratedId";
import { useStickyLineStore, useStickyLineStoreInstance } from "./stickyStore";

// MARK: Component
export default function StickySection({ children, ...props }) {
	const { sectionId: parentSectionId } = useStickySection();

	const sectionId = useGeneratedId("section");
	const unregisterRef = useRef();

	const stickyLineStore = useStickyLineStoreInstance();

	const [registered, setRegistered] = useState(false);

	const systemInitialized = useStickyLineStore(
		(state) => state.systemInitialized
	);
	const registerSection = useStickyLineStore(
		(state) => state.registerSection
	);
	const finalizeSection = useStickyLineStore(
		(state) => state.finalizeSection
	);

	useEffect(() => {
		if (!systemInitialized || registered) {
			return;
		}

		unregisterRef.current = registerSection(sectionId, {
			parentSectionId,
		});

		setRegistered(true);

		return () => {
			if (unregisterRef.current) {
				// unregisterRef.current();
			}
		};
	}, [
		systemInitialized,
		registered,
		registerSection,
		sectionId,
		parentSectionId,
	]);

	// Subscribe to section registrations, and finalize the section when it's ready
	useEffect(() => {
		if (!stickyLineStore) return;

		const unsubscribe = stickyLineStore.subscribe(
			(state) => state.sectionRegistrations.get(sectionId),
			(registration) => {
				if (
					registration &&
					registration?.isReady &&
					registration?.pendingCount === 0 // isReady should already take this into account but just in case...
				) {
					finalizeSection(sectionId);
				}
			}
		);

		return unsubscribe;
	}, [stickyLineStore, sectionId]);

	const contextValue = useMemo(
		() => ({
			sectionId,
			sectionRegistered: registered,
		}),
		[sectionId, registered]
	);

	return (
		<StickySectionContext.Provider value={contextValue}>
			{children}
		</StickySectionContext.Provider>
	);
}

// MARK: Context
const StickySectionContext = React.createContext({
	sectionId: null,
});

// MARK: Hooks
export function useStickySection() {
	const context = React.useContext(StickySectionContext);
	if (!context) {
		throw new Error(
			"useStickySection must be used within a StickySectionProvider"
		);
	}
	return context;
}
