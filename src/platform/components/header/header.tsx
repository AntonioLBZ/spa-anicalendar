import type { HeaderProps } from './header.types';

import './header.css';

const Header = (props: HeaderProps) => {
    const { children, ...rest } = props;
    return (
        <header className="alc-header" {...rest}>
            <div role="heading" aria-level={1}>
                Anicalendar
            </div>
            {children}
        </header>
    );
};

export { Header };
