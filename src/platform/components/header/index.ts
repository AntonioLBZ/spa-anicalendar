import { HeaderRoot } from './header';
import { HeaderActions } from './header-actions';
import { HeaderBrand } from './header-brand';
import { HeaderNav } from './header-nav';

const Header = {
    Root: HeaderRoot,
    Brand: HeaderBrand,
    Nav: HeaderNav,
    Actions: HeaderActions,
};

export { Header };
export type { HeaderRootProps, HeaderBrandProps, HeaderNavProps, HeaderActionsProps } from './header.types';
