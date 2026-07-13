import { fetchMalUpstream, isValidUsername } from '../../_lib/mal-upstream';

export const dynamic = 'force-dynamic';

async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }): Promise<Response> {
    const { username } = await params;

    if (!isValidUsername(username)) {
        return Response.json({ error: 'invalid username' }, { status: 400 });
    }

    const probe = await fetchMalUpstream(`/users/${encodeURIComponent(username)}/animelist?limit=1`);

    if (probe.status !== 200) {
        return probe;
    }

    return Response.json({ name: username }, { status: 200 });
}

export { GET };
