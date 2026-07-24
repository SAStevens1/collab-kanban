import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Room } from "@/components/room";
import { LiveCursors } from "@/components/live-cursors";

export default async function BoardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Room>
      <div className="relative h-screen w-full overflow-hidden bg-zinc-50 dark:bg-black">
        <p className="p-6 text-zinc-500 dark:text-zinc-400">
          Move your cursor around — open this page in another browser to see
          live presence.
        </p>
        <LiveCursors />
      </div>
    </Room>
  );
}
