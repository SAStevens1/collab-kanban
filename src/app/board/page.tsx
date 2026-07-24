import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Room } from "@/components/room";
import { PresenceLayer } from "@/components/live-cursors";
import { KanbanBoard } from "@/components/kanban-board";

export default async function BoardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Room>
      <PresenceLayer>
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
          <KanbanBoard />
        </div>
      </PresenceLayer>
    </Room>
  );
}
