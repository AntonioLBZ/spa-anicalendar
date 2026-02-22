import type { LinkProps } from 'react-aria-components';

type AnimeCardRootProps = LinkProps;

type AnimeCardCoverProps = React.ComponentPropsWithRef<'div'>;

type AnimeCardImageProps = {
    src: string;
    alt: string;
    className?: string;
};

type AnimeCardInfoProps = React.ComponentPropsWithRef<'div'>;

type AnimeCardTitleProps = React.ComponentPropsWithRef<'span'>;

type AnimeCardProgressProps = React.ComponentPropsWithRef<'span'>;

type AnimeCardPendingProps = React.ComponentPropsWithRef<'span'>;

type AnimeCardAiringProps = React.ComponentPropsWithRef<'span'>;

type AnimeCardStatusProps = React.ComponentPropsWithRef<'span'> & {
    variant?: 'releasing' | 'finished' | 'hiatus' | 'cancelled' | 'upcoming';
};

export type {
    AnimeCardAiringProps,
    AnimeCardCoverProps,
    AnimeCardImageProps,
    AnimeCardInfoProps,
    AnimeCardPendingProps,
    AnimeCardProgressProps,
    AnimeCardRootProps,
    AnimeCardStatusProps,
    AnimeCardTitleProps,
};
