import { Liveblocks } from "@liveblocks/node";
import { auth } from "@/auth";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user;
  const userId = user.email ?? user.name ?? "anonymous";

  const liveblocksSession = liveblocks.prepareSession(userId, {
    userInfo: {
      name: user.name ?? "Anonymous",
      avatar: user.image ?? "",
    },
  });

  liveblocksSession.allow("collab-kanban-main", ["*:write"]);

  const { status, body } = await liveblocksSession.authorize();
  return new Response(body, { status });
}
