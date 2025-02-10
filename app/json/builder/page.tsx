"use client"
import React, { useEffect, useState } from "react";
import Board from "@/app/json/builder/board";

interface CardData {
    description: string;
    options?: { text: string; nextRoute: string }[];
    ending?: string;
}

interface CardDataWithPosition extends CardData {
    position: { x: number; y: number };
}

const calculateCardPositions = (cards: { [key: string]: CardData }): { [key: string]: CardDataWithPosition } => {
    const newCards: { [key: string]: CardDataWithPosition } = {};
    const cardWidth = 250; // Ancho de cada carta
    const cardHeight = 200; // Altura base de las cartas
    const marginX = 500; // Margen horizontal entre niveles
    const marginY = 300; // Margen vertical entre cartas

    let levels: { [key: string]: string[] } = { "0": ["1-1"] };
    let visited = new Set(["1-1"]);
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
        let startY = (maxY - (nodes.length * (cardHeight + marginY))) / 2;
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

    const saveJSON = () => {
        const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "updated_decisionTree.json";
        link.click();
    };

    return (
        <div>
            <Board cards={cards} onDeleteCard={handleDeleteCard} onOptionDelete={handleOptionDelete} />
            <button onClick={saveJSON}>Guardar JSON Actualizado</button>
        </div>
    );
};

export default Home;
