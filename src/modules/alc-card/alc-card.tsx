import { Card } from '@/components/card';
import React from 'react';
import {
    getMediaList,
    IGetMediaListParams,
    IMediaListEntry,
} from '../../platform/services/api';
import { link } from 'fs';

const AlcCard = (props2: Object) => {
    const {} = props2;
    const userId = 153365;
    const [cardData, setCardData] = React.useState<IMediaListEntry | null>(
        null
    );

    React.useEffect(() => {
        const d: IGetMediaListParams = {
            userId: userId,
            type: 'ANIME',
            statusIn: ['CURRENT', 'REPEATING'],
        };

        getMediaList(d).then((data) => {
            setCardData(data[0]);
        });
    }, []);

    const props = {
        title: cardData?.media.title.userPreferred || 'Card Title',
        imageURL: cardData?.media.coverImage.medium || '',
        linkURL: cardData?.media.siteUrl || '',
    };

    return (
        <Card.Root
            backgroundURL={props.imageURL}
            href={props.linkURL}
            rel="noopener noreferrer"
            target="_blank"
        >
            <Card.Title>{props.title}</Card.Title>
            <Card.Content>This is the content of the card.</Card.Content>
        </Card.Root>
    );
};

export { AlcCard };
