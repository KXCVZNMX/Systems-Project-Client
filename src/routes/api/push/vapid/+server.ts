import { json } from "@sveltejs/kit";

export const GET = async () => {
    const publicKey = process.env.VAPID_PUBLIC;
    if (!publicKey) {
        return new Response(
            JSON.stringify({ error: "VAPID public key not configured on server." }),
            { status: 500 }
        );
    }

    return json({ publicKey });
};
