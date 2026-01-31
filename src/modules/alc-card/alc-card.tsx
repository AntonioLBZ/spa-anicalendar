import { Card } from '@/components/card';

const AlcCard = (props: Object) => {
    const {} = props;

    return (
        <Card.Root backgroundURL="https://example.com/image.jpg" href="#">
            <Card.Title>Card Title</Card.Title>
            <Card.Content>This is the content of the card.</Card.Content>
        </Card.Root>
    );
};

export { AlcCard };
