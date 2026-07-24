import { prisma } from "@/lib/prisma";

export async function getBoardsForUser(userId: string) {
  const memberships = await prisma.boardMembership.findMany({
    where: { userId },
    include: { board: true },
    orderBy: { board: { createdAt: "desc" } },
  });

  return memberships.map((membership) => ({
    ...membership.board,
    role: membership.role,
  }));
}

export async function getBoardMembership(boardId: string, userId: string) {
  return prisma.boardMembership.findUnique({
    where: { boardId_userId: { boardId, userId } },
  });
}

export async function getBoardWithMembers(boardId: string) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      memberships: {
        include: { user: true },
        orderBy: { id: "asc" },
      },
    },
  });
}
