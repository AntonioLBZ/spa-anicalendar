import { initBotId } from 'botid/client/core';

import { importMigratedStorage } from '@/lib/site-migration';

// The MAL proxy spends the app's MAL client id, so only requests from the app itself may reach it
initBotId({
    protect: [{ path: '/api/mal/*', method: 'GET' }],
});

// Runs before hydration, so persisted stores read the data brought over from the old domain
try {
    importMigratedStorage(window.location, window.localStorage, window.history);
} catch {}
