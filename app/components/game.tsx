import React, { useState, useEffect } from 'react';
import '../css/utils.css';

interface RouteNode {
  description: string;
  options?: Array<{
    text: string;
    nextRoute: string;
  }>;
  ending?: "good" | "bad" | "mixed";
}

interface GameProps {
  jsonFile: string;
  titulo: string;
  nivel: string;
}

const Game: React.FC<GameProps> = ({ jsonFile, titulo }) => {
  const [decisionTree, setDecisionTree] = useState<Record<string, RouteNode>>({});
  const [currentRoute, setCurrentRoute] = useState<string>('1-1');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nivel, setNivel] = useState<number>(() => {
    const savedNivel = localStorage.getItem('nivel');
    return savedNivel ? parseInt(savedNivel) : 1;
  });
  const [showNextLevelButton, setShowNextLevelButton] = useState<boolean>(false);

  useEffect(() => {
    const loadDecisionTree = async () => {
      try {
        const response = await fetch(jsonFile);
        if (!response.ok) {
          throw new Error('Error al cargar el archivo JSON.');
        }
        const data = await response.json();
        setDecisionTree(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar el árbol de decisiones:', error);
        setIsLoading(false);
      }
    };

    loadDecisionTree();
  }, [jsonFile]);

  const handleChoice = (nextRoute: string) => {
    setCurrentRoute(nextRoute);
    setShowNextLevelButton(false);
  };

  const handleRestart = () => {
    setCurrentRoute('1-1');
    setShowNextLevelButton(false);
  };

  const handleNextLevel = () => {
    const savedNivel = parseInt(localStorage.getItem('nivel') || '1');
    
    // Solo aumenta de nivel si el nivel actual es igual al nivel almacenado
    if (nivel === savedNivel) {
        const newNivel = nivel + 1;
        setNivel(newNivel);
        localStorage.setItem('nivel', newNivel.toString()); 
    }
    
    window.location.reload();
};

  const currentNode = decisionTree[currentRoute];

  useEffect(() => {
    if (currentNode?.ending === 'good') {
      setShowNextLevelButton(true);
    }
  }, [currentNode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const getBackgroundClass = () => {
    if (currentNode?.ending === 'good') return 'good-end-background';
    if (currentNode?.ending === 'bad') return 'bad-end-background';
    if (currentNode?.ending === 'mixed') return 'mixed-end-background';
    return 'normal-background';
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center p-4 ${getBackgroundClass()}`}>
      <ul className="background">
        {[...Array(10)].map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">{titulo}</h2>
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ruta: {currentRoute}</h2>
      <div className="max-w-lg mx-auto p-6">
        <p className="text-lg sm:text-xl mb-8 bg-gray-500 p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105">
          {currentNode?.description}
        </p>
      </div>
      {currentNode?.ending ? (
        <>
          <p className="text-2xl">
            {currentNode.ending === 'good' ? 'Final bueno' : currentNode.ending === 'bad' ? 'Final malo' : 'Final mixto'}.
          </p>
          <button
            className="decision-button mt-4 px-4 py-2 text-lg sm:text-xl rounded-md shadow-sm transition-all duration-300 ease-in-out"
            onClick={handleRestart}
          >
            Reiniciar Juego
          </button>
          {showNextLevelButton && (
            <button
              className="decision-button mt-4 px-4 py-2 text-lg sm:text-xl rounded-md shadow-sm transition-all duration-300 ease-in-out"
              onClick={handleNextLevel}
            >
              Próximo nivel
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 decisions">
          {currentNode?.options?.map((option) => (
            <button
              key={option.text}
              className="decision-button px-4 py-2 text-lg sm:text-xl rounded-md shadow-sm transition-all duration-300 ease-in-out"
              onClick={() => handleChoice(option.nextRoute)}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Game;
