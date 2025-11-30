import clsx from 'clsx';

const cn = (...classNames: Parameters<typeof clsx>): string => {
    return clsx(classNames);
};

export { cn };
