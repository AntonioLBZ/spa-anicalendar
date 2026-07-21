import clsx from 'clsx';

import type { SectionRootProps } from './section.types';

import './section.css';

const SectionRoot = (props: SectionRootProps) => {
    const { className, disabled, children, ...rest } = props;

    const sectionClsx = clsx('section', disabled && 'section--disabled', className);

    return (
        <section className={sectionClsx} {...rest}>
            {children}
        </section>
    );
};

export { SectionRoot };
