import React, {useEffect, useState, useRef, useCallback} from 'react';
import Card from '@/app/json/builder/card';
import {Arrow} from 'react-absolute-svg-arrows';
import {Option} from "commander";

interface CardData {
    description: string;
    options?: { text: string; nextRoute: string; coordinates?: { x: number; y: number } }[];
    ending?: string;
    position?: { x: number; y: number };
}

interface BoardProps {
    cards: { [key: string]: CardData },
    onDeleteCard: (id: string) => void,
    onOptionDelete?: (cardId: string, index: number, updatedOptions: Option[]) => void
}

const Board: React.FC<BoardProps> = ({cards, onOptionDelete, onDeleteCard}) => {
    const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
    const [optionCoordinates, setOptionCoordinates] = useState<{ [key: string]: { x: number; y: number } }>({});
    const rootRef = useRef<HTMLDivElement | null>(null);

    const handleOptionCoordinatesUpdate = useCallback(
        (optionIndex: number, coords: { x: number; y: number }) => {
            setOptionCoordinates((prev) => {
                if (prev[optionIndex]?.x === coords.x && prev[optionIndex]?.y === coords.y) {
                    return prev;
                }
                return {
                    ...prev,
                    [optionIndex]: coords,
                };
            });
        },
        []
    );

    useEffect(() => {
        if (Object.keys(cards).length > 0) {
            const newPositions = Object.fromEntries(
                Object.entries(cards).map(([id, card], index) => [
                    id,
                    card.position || {x: index * 300, y: 100},
                ])
            );
            setPositions(newPositions);

            requestAnimationFrame(() => {
                if (rootRef.current) {
                    rootRef.current.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
                }
            });
        }
    }, [cards]);

    const handleDrag = (id: string, x: number, y: number) => {
        setPositions((prev) => ({
            ...prev,
            [id]: {x, y},
        }));
    };


    return (
        <div style={{position: 'relative', width: '100%', height: '100vh', overflow: 'auto'}}>
            {Object.entries(cards).map(([id, card]) => (
                <Card
                    key={id}
                    id={id}
                    description={card.description}
                    options={card.options}
                    ending={card.ending}
                    position={positions[id] || {x: 0, y: 0}}
                    onDrag={handleDrag}
                    onOptionCoordinatesUpdate={handleOptionCoordinatesUpdate}
                    ref={id === "1-1" ? rootRef : null}
                    onDeleteOption={onOptionDelete}
                    onDeleteCard={onDeleteCard}
                />
            ))}
            {Object.entries(cards).map(([id, card]) =>
                card.options?.map((option, index) => {
                    const nextRoute = option?.nextRoute?.trim();
                    if (!nextRoute || !cards[nextRoute]) {
                        console.warn(`La ruta ${nextRoute} no existe en el JSON.`);
                        return null;
                    }

                    if (!positions[id] || !positions[nextRoute]) return null;

                    const sourceX = option.coordinates?.x || positions[id].x + 280;
                    const sourceY = option.coordinates?.y || positions[id].y + 50 + index * 30;

                    const targetX = positions[nextRoute].x - 10;
                    const targetY = positions[nextRoute].y + 50;

                    return (
                        <Arrow
                            key={`${id}-${index}`}
                            startPoint={{x: sourceX, y: sourceY}}
                            endPoint={{x: targetX, y: targetY}}
                        />
                    );
                })
            )}
        </div>
    );
};


export default Board;
