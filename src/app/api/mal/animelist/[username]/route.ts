import { fetchMalUpstream, isValidUsername } from '../../_lib/mal-upstream';

export const dynamic = 'force-dynamic';

const ANIMELIST_FIELDS =
    'list_status,num_episodes,status,start_season,genres,main_picture,media_type,nsfw,end_date,average_episode_duration';

const ALLOWED_STATUSES = new Set(['watching', 'plan_to_watch']);
const DEFAULT_STATUS = 'watching';

async function GET(request: Request, { params }: { params: Promise<{ username: string }> }): Promise<Response> {
    const { username } = await params;

    if (!isValidUsername(username)) {
        return Response.json({ error: 'invalid username' }, { status: 400 });
    }

    const requestedStatus = new URL(request.url).searchParams.get('status');
    const status = requestedStatus !== null && ALLOWED_STATUSES.has(requestedStatus) ? requestedStatus : DEFAULT_STATUS;

    return fetchMalUpstream(
        `/users/${encodeURIComponent(username)}/animelist?status=${status}&nsfw=true&fields=${ANIMELIST_FIELDS}&limit=1000`,
    );
}

export { GET };
