import { Liveblocks } from "@liveblocks/node";
import { auth } from "@/auth";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = (await request.json()) as { room?: string };
  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  const user = await requireCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const membership = await prisma.boardMembership.findUnique({
    where: { boardId_userId: { boardId: room, userId: user.id } },
  });
  if (!membership) {
    return new Response("Forbidden", { status: 403 });
  }

  const liveblocksSession = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: session.user.name ?? "Anonymous",
      avatar: session.user.image ?? "",
    },
  });

  liveblocksSession.allow(room, ["room:write"]);

  const { status, body } = await liveblocksSession.authorize();
  return new Response(body, { status });
}
