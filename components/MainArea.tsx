"use client";

import { useApp } from "@/lib/store";
import { CommandArea } from "./CommandArea";
import { TodayPanel } from "./TodayPanel";
import { MeetingsView } from "./views/MeetingsView";
import { RoutinesView } from "./views/RoutinesView";
import { SearchView } from "./views/SearchView";
import { ConversationsView } from "./views/ConversationsView";
import { ActionsView } from "./views/ActionsView";
import { InsightsView } from "./views/InsightsView";
import { MarketplaceView } from "./views/MarketplaceView";

/** Switches the main content area based on the active left-nav view. */
export function MainArea() {
  const { view } = useApp();

  if (view === "search") return <SearchView />;
  if (view === "meetings") return <MeetingsView />;
  if (view === "routines") return <RoutinesView />;
  if (view === "conversations") return <ConversationsView />;
  if (view === "actions") return <ActionsView />;
  if (view === "insights") return <InsightsView />;
  if (view === "marketplace") return <MarketplaceView />;

  // home — the command area + Today widgets
  return (
    <>
      <CommandArea />
      <TodayPanel />
    </>
  );
}
