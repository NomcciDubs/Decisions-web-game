"use client";
import React, { useState, useEffect } from 'react';
import Game from '../components/game';

const GamePage: React.FC = () => {
  const [selectedNivel, setSelectedNivel] = useState<number | null>(null);
  const [maxNivel, setMaxNivel] = useState<number>(1);

  useEffect(() => {
    let savedNivel = localStorage.getItem('nivel');
    if (!savedNivel) {
      localStorage.setItem('nivel', '1'); // Inicializar en 1 si no existe
      savedNivel = '1';
    }
    setMaxNivel(parseInt(savedNivel));
  }, []);

  const handleNivelSelect = (nivel: number) => {
    setSelectedNivel(nivel);
  };

  // Obtener el archivo JSON correcto segun el nivel seleccionado
  const getJsonFile = (nivel: number) => {
    if (nivel === 2) {
      return "/decisionTree-2.json";
    }
    return "/decisionTree.json"; // Nivel 1 por defecto
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      {/* Título */}
      <h1 className="text-4xl font-bold text-white mb-6">Selecciona tu nivel</h1>

      {/* Botones de selección de nivel */}
      <div className="flex space-x-6 mb-12">
        {/* Nivel 1 */}
        <button
          className={`w-20 h-20 rounded-md text-white font-bold ${
            maxNivel >= 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'
          }`}
          onClick={() => handleNivelSelect(1)}
          disabled={maxNivel < 1}
        >
          1
        </button>

        {/* Nivel 2 */}
        <button
          className={`w-20 h-20 rounded-md text-white font-bold ${
            maxNivel >= 2 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'
          }`}
          onClick={() => handleNivelSelect(2)}
          disabled={maxNivel < 2}
        >
          2
        </button>
      </div>

      {/* Mostrar el juego solo si se ha seleccionado un nivel */}
      {selectedNivel && (
        <Game
          jsonFile={getJsonFile(selectedNivel)}  // Cargar el archivo JSON adecuado
          titulo={`Nivel ${selectedNivel}`}
          nivel={selectedNivel.toString()}
        />
      )}
    </div>
  );
};

export default GamePage;
