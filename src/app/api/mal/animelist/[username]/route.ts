import { fetchMalUpstream, isValidUsername } from '../../_lib/mal-upstream';

export const dynamic = 'force-dynamic';

const ANIMELIST_FIELDS =
    'list_status,num_episodes,status,start_season,genres,main_picture,media_type,nsfw,end_date,average_episode_duration';

async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }): Promise<Response> {
    const { username } = await params;

    if (!isValidUsername(username)) {
        return Response.json({ error: 'invalid username' }, { status: 400 });
    }

    return fetchMalUpstream(
        `/users/${encodeURIComponent(username)}/animelist?status=watching&fields=${ANIMELIST_FIELDS}&limit=1000`,
    );
}

export { GET };
