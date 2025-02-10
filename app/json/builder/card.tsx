import React, { useEffect, useRef, useState } from "react";

interface Option {
    text: string;
    nextRoute: string;
}

interface CardProps {
    id: string;
    description: string;
    options?: Option[];
    ending?: string;
    position?: { x: number; y: number };
    onDrag: (id: string, x: number, y: number) => void;
    onOptionCoordinatesUpdate: (optionIndex: number, coords: { x: number; y: number }) => void;
    onDeleteOption: (id: string, index: number, updatedOptions: Option[]) => void;
    onDeleteCard: (id: string) => void;
    ref?: React.MutableRefObject<HTMLDivElement | null> | null;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 180;
const OPTION_CONTAINER_WIDTH = 250;

const getEndingColor = (ending: string) => {
    switch (ending.toLowerCase()) {
        case "bad":
            return "#ff4d4d";
        case "good":
            return "#4CAF50";
        default:
            return "#4D79FF";
    }
};

const OptionText: React.FC<{
    text: string;
    index: number;
    updateCoordinates: (coords: { x: number; y: number }) => void;
    onDeleteOption: (index: number) => void;
}> = ({ text, index, updateCoordinates, onDeleteOption }) => {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (textRef.current) {
            const rect = textRef.current.getBoundingClientRect();
            updateCoordinates({ x: rect.right, y: rect.top + rect.height / 2 });
        }
    }, []);

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onDeleteOption(index);
    };

    return (
        <div
            ref={textRef}
            style={{
                width: "90%",
                padding: "5px",
                backgroundColor: "#555",
                borderRadius: "5px",
                textAlign: "left",
            }}
            onContextMenu={handleRightClick}
        >
            <p style={{ margin: "0", fontSize: "14px" }}>{text}</p>
        </div>
    );
};

const Card: React.FC<CardProps> = ({
                                       id,
                                       description,
                                       options,
                                       ending,
                                       position,
                                       onDrag,
                                       onOptionCoordinatesUpdate,
                                       onDeleteOption,
                                       onDeleteCard,
                                       ref,
                                   }) => {
    const { x, y } = position || { x: 0, y: 0 };
    const [cardOptions, setCardOptions] = useState<Option[]>(options || []);

    const handleOptionDelete = (index: number) => {
        const updatedOptions = cardOptions.filter((_, idx) => idx !== index);
        setCardOptions(updatedOptions);

        onDeleteOption(id, index, updatedOptions);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const startX = e.clientX - x;
        const startY = e.clientY - y;

        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            onDrag(id, newX, newY);
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleDeleteCard = () => {
        onDeleteCard(id);
    };

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: `${CARD_WIDTH}px`,
                minHeight: `${CARD_HEIGHT}px`,
                backgroundColor: "#444",
                borderRadius: "10px",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.4)",
                padding: "15px",
                cursor: "move",
                textAlign: "center",
                border: "2px solid #000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
            }}
            onMouseDown={handleMouseDown}
        >
            <button
                onClick={handleDeleteCard}
                style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "#fff",
                    border: "2px solid #000",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                X
            </button>

            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold" }}>{id}</h3>
            <p style={{ margin: "0 0 15px 0", fontSize: "14px" }}>{description}</p>

            {cardOptions.length > 0 && (
                <div
                    style={{
                        width: `${OPTION_CONTAINER_WIDTH}px`,
                        borderTop: "2px solid #000",
                        paddingTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        alignItems: "center",
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>Options</h4>
                    {cardOptions.map((option, index) => (
                        <OptionText
                            key={index}
                            index={index}
                            text={option.text}
                            updateCoordinates={(coords) => onOptionCoordinatesUpdate(index, coords)}
                            onDeleteOption={handleOptionDelete}
                        />
                    ))}
                </div>
            )}

            {ending && (
                <div
                    style={{
                        width: `${OPTION_CONTAINER_WIDTH}px`,
                        marginTop: "15px",
                        borderTop: "2px solid #000",
                        paddingTop: "10px",
                        backgroundColor: getEndingColor(ending),
                        borderRadius: "5px",
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>Ending</h4>
                    <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>{ending}</p>
                </div>
            )}
        </div>
    );
};

export default Card;
