import { NextIntlClientProvider } from 'next-intl';

import messages from '@/assets/locales/en.json';

import type { ReactNode } from 'react';

// Uses the real `en.json`
const IntlTestWrapper = (props: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        {props.children}
    </NextIntlClientProvider>
);

export { IntlTestWrapper };
