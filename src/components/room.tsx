"use client";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import type { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id="collab-kanban-main"
        initialPresence={{ cursor: null }}
        initialStorage={{ cards: new LiveMap() }}
      >
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
