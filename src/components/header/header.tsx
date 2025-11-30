import './header.css';
import type { HeaderProps } from './header.types';

const Header = (props: HeaderProps) => {
    const { children, ...rest } = props;
    return (
        <header className="ac-header" {...rest}>
            Anicalendar
            {children}
        </header>
    );
};

export { Header };
