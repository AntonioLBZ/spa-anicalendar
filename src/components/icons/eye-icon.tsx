import type { IconProps } from './icon.types';

const EyeIcon = (props: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export { EyeIcon };
