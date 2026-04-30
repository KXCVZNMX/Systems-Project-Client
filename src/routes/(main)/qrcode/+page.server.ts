import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

const QUEUE_STATUS_ORIGIN = dev ? 'http://localhost:5173' : 'https://systems.server.kvznmx.com';

export const load: PageServerLoad = async ({ fetch, parent }) => {
    const { session } = await parent();
    const email = session?.user?.email;

    if (!email) {
        return {
            queueRank: null,
            queueRankError: 'Sign in to view queue rank.'
        };
    }

    const queueStatusUrl = new URL('/queue/status', QUEUE_STATUS_ORIGIN);
    queueStatusUrl.searchParams.set('userEmail', email);

    try {
        const response = await fetch(queueStatusUrl);

        if (!response.ok) {
            return {
                queueRank: null,
                queueRankError: 'Unable to fetch queue rank right now.'
            };
        }

        const rankText = (await response.text()).trim();
        const rank = Number.parseInt(rankText, 10);

        if (!Number.isInteger(rank) || rank < 1) {
            return {
                queueRank: null,
                queueRankError: 'Queue rank is currently unavailable.'
            };
        }

        return {
            queueRank: rank,
            queueRankError: null
        };
    } catch {
        return {
            queueRank: null,
            queueRankError: 'Queue rank is currently unavailable.'
        };
    }
};

