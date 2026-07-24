import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { signOut } from "@/auth";
import { requireCurrentUser } from "@/lib/current-user";
import { getBoardMembership, getBoardWithMembers } from "@/lib/boards";
import { inviteMember } from "@/lib/board-actions";
import { Room } from "@/components/room";
import { PresenceLayer } from "@/components/live-cursors";
import { KanbanBoard } from "@/components/kanban-board";
import { PresenceAvatars } from "@/components/presence-avatars";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;

  const user = await requireCurrentUser();
  if (!user) {
    redirect("/");
  }

  const membership = await getBoardMembership(boardId, user.id);
  if (!membership) {
    notFound();
  }

  const board = await getBoardWithMembers(boardId);
  if (!board) {
    notFound();
  }

  return (
    <Room roomId={boardId}>
      <PresenceLayer>
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
          <header className="flex items-center justify-between border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-semibold text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                Collab-Kanban
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-sm font-semibold text-black dark:text-zinc-50">
                {board.name}
              </span>
            </div>
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

          {membership.role === "OWNER" && (
            <div className="flex flex-wrap items-center gap-3 border-b border-black/[.08] px-6 py-3 dark:border-white/[.145]">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Members:{" "}
                {board.memberships
                  .map((m) => m.user.name ?? m.user.githubLogin)
                  .join(", ")}
              </span>
              <form
                action={inviteMember.bind(null, boardId)}
                className="flex items-center gap-2"
              >
                <input
                  name="githubLogin"
                  placeholder="GitHub username to invite"
                  className="rounded-md border border-black/[.08] bg-white px-2 py-1 text-xs text-black outline-none focus:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
                />
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background"
                >
                  Invite
                </button>
              </form>
            </div>
          )}

          <KanbanBoard />
        </div>
      </PresenceLayer>
    </Room>
  );
}
