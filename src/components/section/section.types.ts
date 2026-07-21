import type { HTMLAttributes, ReactNode } from 'react';

type SectionRootProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
};

type SectionTitleProps = HTMLAttributes<HTMLHeadingElement> & {
    children: ReactNode;
};

export type { SectionRootProps, SectionTitleProps };
