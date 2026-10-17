import { initBotId } from 'botid/client/core';

// The MAL proxy spends the app's MAL client id, so only requests from the app itself may reach it
initBotId({
    protect: [{ path: '/api/mal/*', method: 'GET' }],
});
