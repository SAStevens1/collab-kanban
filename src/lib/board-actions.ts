"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function createBoard(formData: FormData) {
  const user = await requireCurrentUser();
  if (!user) {
    redirect("/");
  }

  const name = String(formData.get("name") ?? "").trim() || "Untitled board";

  const board = await prisma.board.create({
    data: {
      name,
      ownerId: user.id,
      memberships: {
        create: { userId: user.id, role: "OWNER" },
      },
    },
  });

  redirect(`/board/${board.id}`);
}

export async function inviteMember(boardId: string, formData: FormData) {
  const user = await requireCurrentUser();
  if (!user) {
    redirect("/");
  }

  const membership = await prisma.boardMembership.findUnique({
    where: { boardId_userId: { boardId, userId: user.id } },
  });
  if (membership?.role !== "OWNER") {
    throw new Error("Only the board owner can invite collaborators");
  }

  const githubLogin = String(formData.get("githubLogin") ?? "").trim();
  if (!githubLogin) {
    return;
  }

  const invitedUser = await prisma.user.upsert({
    where: { githubLogin },
    update: {},
    create: { githubLogin },
  });

  await prisma.boardMembership.upsert({
    where: { boardId_userId: { boardId, userId: invitedUser.id } },
    update: {},
    create: { boardId, userId: invitedUser.id, role: "EDITOR" },
  });

  revalidatePath(`/board/${boardId}`);
}
