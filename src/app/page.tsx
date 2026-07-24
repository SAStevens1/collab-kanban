import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { requireCurrentUser } from "@/lib/current-user";
import { getBoardsForUser } from "@/lib/boards";
import { createBoard } from "@/lib/board-actions";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Collab-Kanban
        </h1>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sign in with GitHub
          </button>
        </form>
      </div>
    );
  }

  const user = await requireCurrentUser();
  const boards = user ? await getBoardsForUser(user.id) : [];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 bg-zinc-50 p-8 font-sans dark:bg-black">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Collab-Kanban
        </h1>
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
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Your boards
        </h2>
        {boards.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You're not a member of any boards yet — create one below.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {boards.map((board) => (
              <li key={board.id}>
                <Link
                  href={`/board/${board.id}`}
                  className="flex items-center justify-between rounded-md border border-black/[.08] bg-white px-4 py-3 text-sm hover:bg-black/[.02] dark:border-white/[.145] dark:bg-zinc-900 dark:hover:bg-white/[.04]"
                >
                  <span className="font-medium text-black dark:text-zinc-50">
                    {board.name}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {board.role === "OWNER" ? "Owner" : "Editor"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          New board
        </h2>
        <form action={createBoard} className="flex gap-2">
          <input
            name="name"
            placeholder="Board name"
            className="flex-1 rounded-md border border-black/[.08] bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Create
          </button>
        </form>
      </section>
    </div>
  );
}
