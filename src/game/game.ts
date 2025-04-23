
import { initGame as startGame } from './gameEngine';

// Main Game Class - Delegating to GameEngine for better organization
export function initGame(container: HTMLDivElement) {
  startGame(container);
}
