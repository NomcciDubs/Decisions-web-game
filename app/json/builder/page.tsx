"use client"
import React, { useEffect, useState } from "react";
import Board from "@/app/json/builder/board";

interface CardData {
    description: string;
    options?: { text: string; nextRoute: string }[];
    ending?: string;
}
type Option = {
    text: string;
    nextRoute: string;
};


interface CardDataWithPosition extends CardData {
    position: { x: number; y: number };
}


const calculateCardPositions = (cards: { [key: string]: CardData }): { [key: string]: CardDataWithPosition } => {
    const newCards: { [key: string]: CardDataWithPosition } = {};
    const cardWidth = 250; // Ancho de cada carta
    const cardHeight = 200; // Altura base de las cartas
    const marginX = 500; // Margen horizontal entre niveles
    const marginY = 300; // Margen vertical entre cartas

    const levels: { [key: string]: string[] } = { "0": ["1-1"] };
    const visited = new Set(["1-1"]);
    let maxY = 0;

    let level = 0;
    while (levels[level.toString()] && levels[level.toString()].length > 0) {
        levels[(level + 1).toString()] = [];

        levels[level.toString()].forEach((id, index) => {
            if (!cards[id]) return;

            const posX = level * (cardWidth + marginX);
            const posY = index * (cardHeight + marginY);

            newCards[id] = { ...cards[id], position: { x: posX, y: posY } };

            cards[id].options?.forEach((option) => {
                if (option.nextRoute && !visited.has(option.nextRoute)) {
                    levels[(level + 1).toString()].push(option.nextRoute);
                    visited.add(option.nextRoute);
                }
            });

            maxY = Math.max(maxY, posY);
        });

        level++;
    }

    Object.values(levels).forEach((nodes) => {
        const startY = (maxY - (nodes.length * (cardHeight + marginY))) / 2;
        nodes.forEach((id, index) => {
            if (newCards[id]) newCards[id].position.y = startY + index * (cardHeight + marginY);
        });
    });

    return newCards;
};

const Home: React.FC = () => {
    const [cards, setCards] = useState<{ [key: string]: CardDataWithPosition }>({});

    useEffect(() => {
        fetch("/decisionTree.json")
            .then((response) => response.json())
            .then((data: { [key: string]: CardData }) => {
                const newCards = calculateCardPositions(data);
                setCards(newCards);
            });
    }, []);

    const handleOptionDelete = (cardId: string, index: number, updatedOptions: Option[]) => {
        setCards((prevCards) => {
            const updatedCards = { ...prevCards };
            updatedCards[cardId].options = updatedOptions;
            return updatedCards;
        });
    };

    const handleDeleteCard = (cardId: string) => {
        const updatedCards = { ...cards };

        Object.values(updatedCards).forEach((card) => {
            if (card.options) {
                card.options = card.options.map((option) => {
                    if (option.nextRoute === cardId) {
                        return { ...option, nextRoute: "" };
                    }
                    return option;
                });
            }
        });

        delete updatedCards[cardId];
        setCards(updatedCards);
    };


    return (
        <div>
            <Board cards={cards} onDeleteCard={handleDeleteCard} onOptionDelete={handleOptionDelete} />
        </div>
    );
};

export default Home;
