import { HoverProps } from 'react-aria';

type TCardProps = React.ComponentPropsWithRef<'a'> &
    HoverProps & {
        /**
         * URL of the background image for the card
         */
        backgroundURL?: string;
    };

export type { TCardProps };
