
import { useEffect, useRef, useState } from "react";
import "../game/game.css";
import { initGame } from "../game/game";

const Index = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && gameContainerRef.current) {
      initGame(gameContainerRef.current);
    }
  }, [gameStarted]);

  return (
    <div className="game-wrapper">
      {!gameStarted ? (
        <div className="start-screen">
          <div className="game-title">
            <h1>Ruto&apos;s Road Run</h1>
            <p className="subtitle">A Kenyan Adventure</p>
          </div>
          <div className="character">
            <div className="character-sprite"></div>
          </div>
          <div className="instructions">
            <h2>How to Play</h2>
            <ul>
              <li><span className="key">←</span> <span className="key">→</span> or <span className="key">A</span> <span className="key">D</span> to move</li>
              <li><span className="key">↑</span> or <span className="key">Space</span> to jump</li>
              <li>Collect chapatis, avoid potholes, and reach the matatu stage!</li>
            </ul>
          </div>
          <button className="start-button" onClick={() => setGameStarted(true)}>Start Game</button>
        </div>
      ) : (
        <div className="game-container" ref={gameContainerRef}>
          <div className="game-ui">
            <div className="score-container">Score: <span id="score">0</span></div>
            <div className="lives-container">Lives: <span id="lives">3</span></div>
            <div className="chapati-counter">
              <div className="chapati-icon"></div>
              <span id="chapati-count">0</span>
            </div>
          </div>
          <canvas id="game-canvas"></canvas>
          <div id="game-over" className="game-over hidden">
            <h2>Game Over!</h2>
            <p>Your Score: <span id="final-score">0</span></p>
            <button className="restart-button" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
