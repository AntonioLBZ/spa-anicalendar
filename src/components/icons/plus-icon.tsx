import type { IconProps } from './icon.types';

const PlusIcon = (props: IconProps) => (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
        <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export { PlusIcon };
