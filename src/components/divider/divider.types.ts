import type { SeparatorProps } from 'react-aria-components';

type DividerProps = SeparatorProps & {
    ref?: React.Ref<HTMLHRElement>;
    /**
     * The size of the divider.
     * @default 'm'
     */
    size?: 's' | 'm' | 'l';
};

export type { DividerProps };
