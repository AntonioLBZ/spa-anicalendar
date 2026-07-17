'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components';

import './edit-mode-bar.css';

import type { EditModeBarProps } from './edit-mode-bar.types';

const EditModeBar = (props: EditModeBarProps) => {
    const { isEditMode, hiddenCount, onEnter, onSave, onCancel } = props;
    const t = useTranslations('editMode');

    if (!isEditMode) {
        return (
            <div className="edit-mode-bar">
                <Button variant="ghost" size="s" aria-pressed={false} onPress={onEnter}>
                    {t('edit')}
                </Button>
            </div>
        );
    }

    return (
        <div className="edit-mode-bar">
            <span className="edit-mode-bar__count body-s">{t('hiddenCount', { count: hiddenCount })}</span>
            <Button variant="ghost" size="s" onPress={onCancel}>
                {t('cancel')}
            </Button>
            <Button variant="primary" size="s" onPress={onSave}>
                {t('save')}
            </Button>
        </div>
    );
};

export { EditModeBar };
