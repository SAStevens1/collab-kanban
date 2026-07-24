"use client";

import Image from "next/image";
import { useOthers, useSelf } from "@liveblocks/react";

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  return (
    <div
      title={name}
      className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-zinc-300 dark:border-black dark:bg-zinc-700"
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          fill
          sizes="32px"
          className="object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-700 dark:text-zinc-200">
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function PresenceAvatars() {
  const self = useSelf();
  const others = useOthers();

  return (
    <div className="flex -space-x-2">
      {self && (
        <Avatar name={self.info?.name ?? "You"} avatar={self.info?.avatar} />
      )}
      {others.map(({ connectionId, info }) => (
        <Avatar
          key={connectionId}
          name={info?.name ?? "Anonymous"}
          avatar={info?.avatar}
        />
      ))}
    </div>
  );
}
