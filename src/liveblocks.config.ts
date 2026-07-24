declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
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
