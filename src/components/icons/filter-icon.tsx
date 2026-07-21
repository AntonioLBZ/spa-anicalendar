import type { IconProps } from './icon.types';

const FilterIcon = (props: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 5H17M6 10H14M9 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export { FilterIcon };
