import './header.css';
import type { HeaderProps } from './header.types';

const Header = (props: HeaderProps) => {
    const { children, ...rest } = props;
    return (
        <header className="ac-header" {...rest}>
            <div role="heading" aria-level={1}>
                Anicalendar
            </div>
            {children}
        </header>
    );
};

export { Header };
