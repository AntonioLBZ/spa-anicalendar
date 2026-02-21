import type { HeaderProps } from './header.types';

import './header.css';

const Header = (props: HeaderProps) => {
    const { children, ...rest } = props;
    const headerClsx = 'header';
    return (
        <header className={headerClsx} {...rest}>
            {children}
        </header>
    );
};

export { Header };
