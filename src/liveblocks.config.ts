import type { LiveMap } from "@liveblocks/client";
import type { CardData } from "@/types/kanban";

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };
    Storage: {
      cards: LiveMap<string, CardData>;
    };
    UserMeta: {
      info: {
        name: string;
        avatar: string;
      };
    };
  }
}

export {};
