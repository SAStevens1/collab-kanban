"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import type { PointerEvent } from "react";

const CURSOR_COLORS = [
  "#E57373",
  "#64B5F6",
  "#81C784",
  "#FFB74D",
  "#BA68C8",
  "#4DB6AC",
];

function colorForConnectionId(connectionId: number) {
  return CURSOR_COLORS[connectionId % CURSOR_COLORS.length];
}

export function LiveCursors() {
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    updateMyPresence({ cursor: { x: event.clientX, y: event.clientY } });
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0"
    >
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor) return null;

        return (
          <div
            key={connectionId}
            className="pointer-events-none absolute left-0 top-0 flex items-center gap-2"
            style={{
              transform: `translate(${presence.cursor.x}px, ${presence.cursor.y}px)`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 2l17 7-7 2-2 7-8-16z"
                fill={colorForConnectionId(connectionId)}
              />
            </svg>
            <span
              className="rounded-full px-2 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: colorForConnectionId(connectionId) }}
            >
              {info?.name ?? "Anonymous"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
