'use client';

import { useTranslations } from 'next-intl';

import { Button, EyeIcon } from '@/components';

import './entry-visibility-controls.css';

import type { EntryVisibilityControlsProps } from './entry-visibility.types';

const EntryVisibilityControls = (props: EntryVisibilityControlsProps) => {
    const { isEditMode, onEnter, onSave, onCancel, isAllHidden = false, onToggleAll } = props;
    const t = useTranslations('entryVisibility');

    if (!isEditMode) {
        return (
            <Button variant="ghost" size="s" onPress={onEnter} aria-label={t('edit')}>
                <EyeIcon />
            </Button>
        );
    }

    const toggleAllText = isAllHidden ? t('showAll') : t('hideAll');

    return (
        <div className="entry-visibility-controls">
            {onToggleAll && (
                <Button variant="secondary" size="s" onPress={onToggleAll}>
                    {toggleAllText}
                </Button>
            )}
            <Button variant="secondary" size="s" onPress={onCancel}>
                {t('cancel')}
            </Button>
            <Button variant="primary" size="s" onPress={onSave}>
                {t('save')}
            </Button>
        </div>
    );
};

export { EntryVisibilityControls };
