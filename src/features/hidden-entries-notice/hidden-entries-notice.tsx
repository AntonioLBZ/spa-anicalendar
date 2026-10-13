'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Button, DismissIcon, InfoIcon } from '@/components';

import { useHiddenEntriesNotice } from './use-hidden-entries-notice';

import type { HiddenEntriesNoticeProps } from './hidden-entries-notice.types';

import './hidden-entries-notice.css';

const HiddenEntriesNotice = (props: HiddenEntriesNoticeProps) => {
    const { counts, contentFilter } = props;
    const t = useTranslations('hiddenEntriesNotice');
    const tFilters = useTranslations('seasonalFilters');
    const format = useFormatter();
    const { state, data, actions } = useHiddenEntriesNotice(props);

    if (!state.isVisible) return null;

    const reasonTexts = data.reasons.map((reason) =>
        reason === 'content'
            ? t('content', { count: counts.content, filter: tFilters(`content.${contentFilter}`) })
            : t(reason, { count: counts[reason] })
    );

    return (
        <div className="hidden-notice">
            <InfoIcon className="hidden-notice__icon" aria-hidden="true" />
            <p className="hidden-notice__text body-m">
                {t.rich('message', {
                    summary: t('summary', { count: data.total }),
                    reasons: format.list(reasonTexts),
                    b: (chunks) => <strong>{chunks}</strong>,
                })}
            </p>
            <Button
                className="hidden-notice__dismiss"
                variant="ghost"
                size="s"
                aria-label={t('dismiss')}
                onPress={actions.dismiss}
            >
                <DismissIcon />
            </Button>
        </div>
    );
};

export { HiddenEntriesNotice };
