import { json } from '@sveltejs/kit';
import fs from 'fs/promises';

const FILE = `${process.cwd()}/push-subscriptions.json`;

export const POST = async ({ request }) => {
	try {
		const sub = await request.json();

		let subs = [];
		try {
			const raw = await fs.readFile(FILE, 'utf8');
			subs = JSON.parse(raw || '[]');
		} catch (e) {
			subs = [];
		}

		if (!subs.find((s) => s.endpoint === sub.endpoint)) {
			subs.push(sub);
			await fs.writeFile(FILE, JSON.stringify(subs, null, 2), 'utf8');
		}

		return new Response(null, { status: 201 });
	} catch (e) {
		return json({ error: String(e) }, { status: 500 });
	}
};


