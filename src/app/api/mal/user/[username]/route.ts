import { checkBotId } from 'botid/server';

import { fetchMalAvatarUrl } from '../../_lib/mal-profile';
import { accessDeniedResponse, fetchMalUpstream, isValidUsername } from '../../_lib/mal-upstream';

async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }): Promise<Response> {
    const { username } = await params;

    if (!isValidUsername(username)) {
        return Response.json({ error: 'invalid username' }, { status: 400 });
    }

    if ((await checkBotId()).isBot) {
        return accessDeniedResponse();
    }

    // Requested alongside the probe so the avatar adds no latency; ignored if the user doesn't exist
    const avatarUrlPromise = fetchMalAvatarUrl(username);
    const probe = await fetchMalUpstream(`/users/${encodeURIComponent(username)}/animelist?limit=1`);

    if (probe.status !== 200) {
        return probe;
    }

    const avatarUrl = await avatarUrlPromise;

    return Response.json({ name: username, ...(avatarUrl && { avatarUrl }) }, { status: 200 });
}

export { GET };
