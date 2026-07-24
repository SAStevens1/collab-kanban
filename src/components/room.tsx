"use client";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import type { ReactNode } from "react";

export function Room({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null }}
        initialStorage={{ cards: new LiveMap() }}
      >
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
