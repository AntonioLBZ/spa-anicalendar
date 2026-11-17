'use client';

import { useTranslations } from 'next-intl';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';

import { Button } from '@/components';

import { useDomainMoveDialog } from './use-domain-move-dialog';

import type { ReactNode } from 'react';

import './domain-move-dialog.css';

const DomainMoveDialog = () => {
    const t = useTranslations('domainMove');
    const { state, data, actions } = useDomainMoveDialog();

    const domain = (chunks: ReactNode) => <strong className="domain-move__domain">{chunks}</strong>;

    return (
        <ModalOverlay
            className="domain-move__overlay"
            isDismissable
            isOpen={state.isOpen}
            onOpenChange={actions.setIsOpen}
        >
            <Modal className="domain-move">
                <Dialog className="domain-move__dialog">
                    <Heading slot="title" className="domain-move__title title-m">
                        {t('title')}
                    </Heading>
                    <p className="domain-move__text body-m">{t.rich('message', { domain, newHost: data.newHost })}</p>
                    {state.isInstalled && (
                        <p className="domain-move__text domain-move__text--installed body-m">{t('installed')}</p>
                    )}
                    <p className="domain-move__text body-s">{t('dataNote')}</p>
                    <div className="domain-move__actions">
                        <Button variant="ghost" onPress={() => actions.setIsOpen(false)}>
                            {t('later')}
                        </Button>
                        <Button autoFocus onPress={actions.moveNow}>
                            {t('go')}
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export { DomainMoveDialog };
