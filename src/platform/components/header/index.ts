import { HeaderRoot } from './header';
import { HeaderActions } from './header-actions';
import { HeaderBrand } from './header-brand';
import { HeaderContent } from './header-content';
import { HeaderNav } from './header-nav';

const Header = {
    Root: HeaderRoot,
    Content: HeaderContent,
    Brand: HeaderBrand,
    Nav: HeaderNav,
    Actions: HeaderActions,
};

export { Header };
export type {
    HeaderRootProps,
    HeaderContentProps,
    HeaderBrandProps,
    HeaderNavProps,
    HeaderActionsProps,
} from './header.types';
