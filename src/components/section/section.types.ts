import type { HTMLAttributes, ReactNode } from 'react';

type SectionRootProps = HTMLAttributes<HTMLElement> & {
    disabled?: boolean;
    children: ReactNode;
};

type SectionTitleProps = HTMLAttributes<HTMLHeadingElement> & {
    children: ReactNode;
};

export type { SectionRootProps, SectionTitleProps };
