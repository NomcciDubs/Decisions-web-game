"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import './css/utils.css'; // Importamos los estilos

const IntroPage: React.FC = () => {
    const router = useRouter();

    const handleContinue = () => {
        router.push('/game');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 bg-gray-900">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Bienvenido al Juego de Decisiones</h1>
            <p className="text-lg sm:text-xl mb-4 text-gray-300">
                Este es un juego interactivo diseñado para ayudarte a entender el concepto de la ingeniería y su
                relación
                con la tecnología y la ciencia a través de decisiones. A medida que avanzas, tomarás decisiones que te
                llevarán a
                diferentes resultados.
            </p>
            <p className="text-lg sm:text-xl mb-8 text-gray-300">
                Algunas decisiones pueden llevarte a un final positivo, mientras que otras pueden llevarte a un final
                menos favorable.
            </p>
            <button
                onClick={handleContinue}
                className="menu-button px-6 py-3 text-lg sm:text-xl rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
            >
                Continuar
            </button>
        </div>
    );
};

export default IntroPage;
