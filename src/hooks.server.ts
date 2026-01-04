import { auth } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";

export const handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  if (session) {
    event.locals.session = session.session;

    // Fetch user with role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    event.locals.user = user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
};
