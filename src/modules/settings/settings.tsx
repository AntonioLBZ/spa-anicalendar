'use client';

import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';

import { ThemeButton } from '@/modules/theme-button';

import './settings.css';

// TODO: Replace with an actual icon or use an icon library
const GearIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        />
    </svg>
);

const Settings = () => {
    return (
        <DialogTrigger>
            <Button className="settings__trigger" aria-label="Settings">
                <GearIcon />
            </Button>
            <Popover placement="bottom end" className="settings__panel">
                <Dialog className="settings__dialog">
                    <section className="settings__section">
                        <h3 className="settings__section-title">Theme</h3>
                        <ThemeButton />
                    </section>
                    <section className="settings__section settings__section--disabled">
                        <h3 className="settings__section-title">Filters</h3>
                        <p className="settings__placeholder">Coming soon</p>
                    </section>
                    <section className="settings__section settings__section--disabled">
                        <h3 className="settings__section-title">Display</h3>
                        <p className="settings__placeholder">Coming soon</p>
                    </section>
                    <section className="settings__section settings__section--disabled">
                        <h3 className="settings__section-title">Language</h3>
                        <p className="settings__placeholder">Coming soon</p>
                    </section>
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};

export { Settings };
