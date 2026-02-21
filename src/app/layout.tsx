'use client';

import React from 'react';
import { AlcHeader, AlcBody } from '@/modules';

type TLayoutRootProps = {
    children: React.ReactNode;
};

export default function LayoutRoot(props: TLayoutRootProps) {
    const { children } = props;
    return (
        <html lang="en">
            <head />
            <AlcBody>
                <AlcHeader />
                {children}
            </AlcBody>
        </html>
    );
}
