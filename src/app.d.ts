// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from "better-auth";
import type { Role } from "@prisma/client";

type AppUser = {
	id: string;
	email: string;
	name: string | null;
	image: string | null;
	role: Role;
	createdAt: Date;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			user: AppUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
