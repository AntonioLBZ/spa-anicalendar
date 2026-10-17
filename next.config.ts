import { withBotId } from 'botid/next/config';
import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: { unoptimized: true },
};

export default withNextIntl(withBotId(nextConfig));
