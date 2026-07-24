import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireCurrentUser() {
  const session = await auth();
  if (!session?.user?.login) {
    return null;
  }

  return prisma.user.upsert({
    where: { githubLogin: session.user.login },
    update: {
      name: session.user.name ?? undefined,
      avatarUrl: session.user.image ?? undefined,
    },
    create: {
      githubLogin: session.user.login,
      name: session.user.name ?? undefined,
      avatarUrl: session.user.image ?? undefined,
    },
  });
}
