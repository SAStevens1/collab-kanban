import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Room } from "@/components/room";
import { PresenceLayer } from "@/components/live-cursors";
import { KanbanBoard } from "@/components/kanban-board";
import { PresenceAvatars } from "@/components/presence-avatars";

export default async function BoardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Room>
      <PresenceLayer>
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
          <header className="flex items-center justify-between border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
            <Link
              href="/"
              className="text-sm font-semibold text-black dark:text-zinc-50"
            >
              collab-kanban
            </Link>
            <div className="flex items-center gap-4">
              <PresenceAvatars />
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-solid border-black/[.08] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>
          <KanbanBoard />
        </div>
      </PresenceLayer>
    </Room>
  );
}
