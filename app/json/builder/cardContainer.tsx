import React, { useState } from 'react';
import Card from '@/app/json/builder/card';

interface CardData {
    description: string;
    options?: { text: string; nextRoute: string }[];
    ending?: string;
}

interface CardContainerProps {
    cards: { [key: string]: CardData };
}

const CardContainer: React.FC<CardContainerProps> = ({ cards }) => {
    const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

    const handleDrag = (id: string, x: number, y: number) => {
        setPositions((prev) => ({
            ...prev,
            [id]: { x, y },
        }));
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {Object.entries(cards).map(([id, card]) => (
                <Card
                    key={id}
                    id={id}
                    description={card.description}
                    options={card.options}
                    ending={card.ending}
                    position={positions[id] || { x: 0, y: 0 }}
                    onDrag={handleDrag}
                />
            ))}
        </div>
    );
};

export default CardContainer;