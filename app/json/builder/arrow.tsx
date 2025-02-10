import React from 'react';

interface ArrowProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const Arrow: React.FC<ArrowProps> = ({ x1, y1, x2, y2 }) => {
    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10, // Asegura que el SVG esté en la parte superior
            }}
        >
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"  // Color de la flecha
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="white" />  {/* Flecha de color blanco */}
                </marker>
            </defs>
        </svg>
    );
};

export default Arrow;
