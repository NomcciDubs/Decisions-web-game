"use client";
import React from 'react';
import Game from '../components/game';

const GamePage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <Game />
        </div>
    );
};

export default GamePage;
