import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "$lib/db";
import GitHub from "@auth/sveltekit/providers/github";

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [GitHub],
    adapter: MongoDBAdapter(client)
});
