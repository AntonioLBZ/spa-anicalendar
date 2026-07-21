import clsx from 'clsx';

import type { SectionTitleProps } from './section.types';

const SectionTitle = (props: SectionTitleProps) => {
    const { className, children, ...rest } = props;

    const sectionTitleClsx = clsx('section__title', 'label-m', className);

    return (
        <h3 className={sectionTitleClsx} {...rest}>
            {children}
        </h3>
    );
};

export { SectionTitle };
