
import { Player } from './player';
import { Collectible } from './collectible';
import { Obstacle } from './obstacle';
import { Enemy } from './enemy';
import { Level } from './level';

// Main Game Engine
export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameRunning: boolean = true;
  private score: number = 0;
  private lives: number = 3;
  private chapatiCount: number = 0;
  private player: Player;
  private level: Level;
  private gameTime: number = 0;
  private keys: { [key: string]: boolean } = {};
  
  // DOM elements
  private scoreElement: HTMLElement;
  private livesElement: HTMLElement;
  private chapatiCountElement: HTMLElement;
  private gameOverElement: HTMLElement;
  private finalScoreElement: HTMLElement;
  
  // Game state
  private gameState = {
    scrollX: 0,
    levelWidth: 5000,
    bgLayers: [
      { img: null, speed: 0.1, x: 0 }, // Far background
      { img: null, speed: 0.3, x: 0 }, // Mid background
      { img: null, speed: 0.5, x: 0 }, // Close background
    ]
  };

  // Game constants
  private readonly GRAVITY = 0.5;
  private readonly GROUND_HEIGHT = 60;
  private readonly PLAYER_WIDTH = 50;
  private readonly PLAYER_HEIGHT = 80;

  constructor(container: HTMLDivElement) {
    // Initialize canvas
    this.canvas = container.querySelector('#game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Adjust canvas size to match container
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    
    // Initialize DOM elements
    this.scoreElement = document.getElementById('score')!;
    this.livesElement = document.getElementById('lives')!;
    this.chapatiCountElement = document.getElementById('chapati-count')!;
    this.gameOverElement = document.getElementById('game-over')!;
    this.finalScoreElement = document.getElementById('final-score')!;
    
    // Create player
    this.player = new Player(
      100, 
      this.canvas.height - this.GROUND_HEIGHT - this.PLAYER_HEIGHT,
      this.PLAYER_WIDTH,
      this.PLAYER_HEIGHT
    );
    
    // Create level
    this.level = new Level(this.gameState.levelWidth, this.canvas.height, this.GROUND_HEIGHT);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start game loop
    this.gameLoop();
  }
  
  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }
  
  private gameLoop(): void {
    if (!this.gameRunning) return;
    
    this.gameTime++;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update game state
    this.update();
    
    // Draw game elements
    this.draw();
    
    // Request next frame
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  private update(): void {
    // Handle player movement
    this.handlePlayerMovement();
    
    // Update player position
    this.updatePlayerPosition();
    
    // Check collisions
    this.checkCollisions();
    
    // Update enemies
    this.updateEnemies();
    
    // Check if player reached the matatu stage (win condition)
    if (
      this.player.x + this.player.width > this.level.finish.x &&
      this.player.x < this.level.finish.x + this.level.finish.width &&
      this.player.y + this.player.height > this.level.finish.y &&
      this.player.y < this.level.finish.y + this.level.finish.height
    ) {
      // Player won!
      this.score += 1000;
      this.endGame(true);
    }
    
    // Update UI
    this.updateUI();
  }
  
  private handlePlayerMovement(): void {
    // Reset velocity X
    this.player.stopMoving();
    
    // Move left
    if ((this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) && this.player.x > 10) {
      this.player.moveLeft();
    }
    
    // Move right
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.player.moveRight();
    }
    
    // Jump
    if ((this.keys['ArrowUp'] || this.keys[' '] || this.keys['w'] || this.keys['W']) && this.player.isOnGround) {
      this.player.jump();
    }
  }
  
  private updatePlayerPosition(): void {
    // Update player
    this.player.update(this.gameTime);
    
    // Check if player is on ground
    if (this.player.y + this.player.height > this.canvas.height - this.GROUND_HEIGHT) {
      this.player.y = this.canvas.height - this.GROUND_HEIGHT - this.player.height;
      this.player.land();
    }
    
    // Check if player fell off screen
    if (this.player.y > this.canvas.height) {
      this.loseLife();
      this.resetPlayer();
    }
    
    // Update camera/scroll position (follow player)
    this.gameState.scrollX = this.player.x - this.canvas.width / 3;
    
    // Ensure scrollX doesn't go negative
    if (this.gameState.scrollX < 0) this.gameState.scrollX = 0;
    
    // Ensure scrollX doesn't exceed level bounds
    if (this.gameState.scrollX > this.gameState.levelWidth - this.canvas.width) {
      this.gameState.scrollX = this.gameState.levelWidth - this.canvas.width;
    }
    
    // Update background parallax
    this.gameState.bgLayers.forEach(layer => {
      layer.x = -this.gameState.scrollX * layer.speed;
    });
  }
  
  private checkCollisions(): void {
    // Check platform collisions
    let onPlatform = false;
    
    for (const platform of this.level.platforms) {
      // Check if player is on platform
      if (
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x + platform.width &&
        this.player.y + this.player.height <= platform.y + 5 && // Small tolerance
        this.player.y + this.player.height + this.player.velocityY >= platform.y
      ) {
        this.player.y = platform.y - this.player.height;
        this.player.land();
        onPlatform = true;
      }
    }
    
    // If not on any platform and not on ground, player is in the air
    if (!onPlatform && this.player.y + this.player.height < this.canvas.height - this.GROUND_HEIGHT) {
      this.player.isOnGround = false;
    }
    
    // Check chapati collisions
    for (const collectible of this.level.collectibles) {
      if (!collectible.collected &&
        this.player.x + this.player.width > collectible.x &&
        this.player.x < collectible.x + collectible.width &&
        this.player.y + this.player.height > collectible.y &&
        this.player.y < collectible.y + collectible.height
      ) {
        collectible.collected = true;
        
        if (collectible.type === 'chapati') {
          this.chapatiCount++;
          this.score += 100;
        } else if (collectible.type === 'vote') {
          this.score += 200;
        } else {
          this.score += 50;
        }
      }
    }
    
    // Check pothole collisions
    for (const obstacle of this.level.obstacles) {
      if (obstacle.type === 'pothole') {
        if (
          this.player.x + this.player.width * 0.7 > obstacle.x &&
          this.player.x + this.player.width * 0.3 < obstacle.x + obstacle.width &&
          this.player.y + this.player.height > obstacle.y &&
          this.player.y + this.player.height < obstacle.y + obstacle.height + 5 &&
          this.player.isOnGround
        ) {
          this.loseLife();
          this.resetPlayer();
          break;
        }
      } else if (obstacle.type === 'sufuria') {
        if (
          this.player.x + this.player.width * 0.7 > obstacle.x &&
          this.player.x + this.player.width * 0.3 < obstacle.x + obstacle.width &&
          this.player.y + this.player.height > obstacle.y &&
          this.player.y < obstacle.y + obstacle.height
        ) {
          this.loseLife();
          this.resetPlayer();
          break;
        }
      }
    }
    
    // Check enemy collisions
    for (const enemy of this.level.enemies) {
      if (
        enemy.active &&
        this.player.x + this.player.width * 0.7 > enemy.x &&
        this.player.x + this.player.width * 0.3 < enemy.x + enemy.width &&
        this.player.y + this.player.height > enemy.y &&
        this.player.y < enemy.y + enemy.height
      ) {
        this.loseLife();
        this.resetPlayer();
        
        // Show enemy message
        enemy.showingMessage = true;
        enemy.messageTimer = 60; // Show for 60 frames
        
        break;
      }
    }
  }
  
  private updateEnemies(): void {
    // Update obstacles
    this.level.obstacles.forEach(obstacle => {
      if (obstacle.type === 'sufuria') {
        // Apply gravity to sufuria
        obstacle.velocityY += 0.2;
        obstacle.y += obstacle.velocityY;
        
        // Reset if out of view
        if (obstacle.y > obstacle.startY + 300) {
          obstacle.y = obstacle.startY;
          obstacle.velocityY = -5;
        }
      }
    });
    
    // Update enemies
    this.level.enemies.forEach(enemy => {
      // Move enemy back and forth
      enemy.x += enemy.speed * enemy.direction;
      
      // Change direction if reached movement limit
      if (
        enemy.x <= enemy.startX - enemy.moveRange ||
        enemy.x >= enemy.startX + enemy.moveRange
      ) {
        enemy.direction *= -1;
      }
      
      // Update message timer
      if (enemy.showingMessage) {
        enemy.messageTimer--;
        if (enemy.messageTimer <= 0) {
          enemy.showingMessage = false;
        }
      }
    });
  }
  
  private resetPlayer(): void {
    // Place player at a safe position
    this.player.reset(Math.max(100, this.player.x - 200), this.canvas.height - this.GROUND_HEIGHT - this.PLAYER_HEIGHT);
  }
  
  private loseLife(): void {
    const gameOver = this.player.loseLife();
    this.lives = this.player.lives;
    
    if (gameOver) {
      this.endGame(false);
    }
  }
  
  private endGame(win: boolean): void {
    this.gameRunning = false;
    
    if (win) {
      this.score += this.lives * 500; // Bonus for remaining lives
    }
    
    // Update final score
    this.finalScoreElement.textContent = this.score.toString();
    
    // Show game over screen
    this.gameOverElement.classList.remove('hidden');
  }
  
  private updateUI(): void {
    this.scoreElement.textContent = this.score.toString();
    this.livesElement.textContent = this.lives.toString();
    this.chapatiCountElement.textContent = this.chapatiCount.toString();
  }
  
  private draw(): void {
    // Draw sky background
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background layers (would be more detailed with actual images)
    // Far mountains
    this.ctx.fillStyle = '#9b87f5';
    for (let i = 0; i < 5; i++) {
      const mountainX = i * 300 - (this.gameState.scrollX * 0.1) % 300;
      const mountainWidth = 300;
      const mountainHeight = 150;
      
      // Draw mountain shape
      this.ctx.beginPath();
      this.ctx.moveTo(mountainX, this.canvas.height - this.GROUND_HEIGHT - mountainHeight);
      this.ctx.lineTo(mountainX + mountainWidth/2, this.canvas.height - this.GROUND_HEIGHT - mountainHeight * 1.5);
      this.ctx.lineTo(mountainX + mountainWidth, this.canvas.height - this.GROUND_HEIGHT - mountainHeight);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Mid hills
    this.ctx.fillStyle = '#8B5CF6';
    for (let i = 0; i < 8; i++) {
      const hillX = i * 200 - (this.gameState.scrollX * 0.3) % 200;
      const hillWidth = 200;
      const hillHeight = 100;
      
      // Draw hill shape (smoother curve)
      this.ctx.beginPath();
      this.ctx.moveTo(hillX, this.canvas.height - this.GROUND_HEIGHT);
      this.ctx.quadraticCurveTo(
        hillX + hillWidth/2, this.canvas.height - this.GROUND_HEIGHT - hillHeight,
        hillX + hillWidth, this.canvas.height - this.GROUND_HEIGHT
      );
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Near bushes
    this.ctx.fillStyle = '#228B22';
    for (let i = 0; i < 15; i++) {
      const bushX = i * 100 - (this.gameState.scrollX * 0.5) % 100;
      const bushWidth = 80;
      const bushHeight = 40;
      
      // Draw bush shape
      this.ctx.beginPath();
      this.ctx.arc(bushX + bushWidth/4, this.canvas.height - this.GROUND_HEIGHT - bushHeight/2, bushHeight/2, 0, Math.PI * 2);
      this.ctx.arc(bushX + bushWidth/2, this.canvas.height - this.GROUND_HEIGHT - bushHeight*0.8, bushHeight/2, 0, Math.PI * 2);
      this.ctx.arc(bushX + bushWidth*3/4, this.canvas.height - this.GROUND_HEIGHT - bushHeight/2, bushHeight/2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw ground
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, this.canvas.height - this.GROUND_HEIGHT, this.canvas.width, this.GROUND_HEIGHT);
    
    // Add some grass on top of the ground
    this.ctx.fillStyle = '#228B22';
    this.ctx.fillRect(0, this.canvas.height - this.GROUND_HEIGHT, this.canvas.width, 10);
    
    // Draw platforms
    this.level.platforms.forEach(platform => {
      const platformScreenX = platform.x - this.gameState.scrollX;
      
      // Only draw if visible on screen
      if (
        platformScreenX + platform.width > 0 &&
        platformScreenX < this.canvas.width
      ) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(platformScreenX, platform.y, platform.width, platform.height);
        
        // Add some grass on top
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(platformScreenX, platform.y, platform.width, 5);
      }
    });
    
    // Draw potholes
    this.level.obstacles.forEach(obstacle => {
      if (obstacle.type === 'pothole') {
        const potholeScreenX = obstacle.x - this.gameState.scrollX;
        
        if (
          potholeScreenX + obstacle.width > 0 &&
          potholeScreenX < this.canvas.width
        ) {
          this.ctx.fillStyle = '#000000';
          this.ctx.beginPath();
          this.ctx.ellipse(
            potholeScreenX + obstacle.width/2,
            obstacle.y + obstacle.height/2,
            obstacle.width/2,
            obstacle.height/2,
            0, 0, Math.PI * 2
          );
          this.ctx.fill();
          
          // Add some depth to pothole
          this.ctx.fillStyle = '#222222';
          this.ctx.beginPath();
          this.ctx.ellipse(
            potholeScreenX + obstacle.width/2,
            obstacle.y + obstacle.height/2,
            obstacle.width/3,
            obstacle.height/3,
            0, 0, Math.PI * 2
          );
          this.ctx.fill();
        }
      } else if (obstacle.type === 'sufuria') {
        const sufuriaScreenX = obstacle.x - this.gameState.scrollX;
        
        if (
          sufuriaScreenX + obstacle.width > 0 &&
          sufuriaScreenX < this.canvas.width
        ) {
          // Draw sufuria (cooking pot)
          // Main pot
          this.ctx.fillStyle = '#666666';
          this.ctx.beginPath();
          this.ctx.ellipse(
            sufuriaScreenX + obstacle.width/2,
            obstacle.y + obstacle.height/2,
            obstacle.width/2,
            obstacle.height/3,
            0, 0, Math.PI * 2
          );
          this.ctx.fill();
          
          // Handle
          this.ctx.strokeStyle = '#333333';
          this.ctx.lineWidth = 4;
          this.ctx.beginPath();
          this.ctx.moveTo(sufuriaScreenX + obstacle.width - 5, obstacle.y + obstacle.height/3);
          this.ctx.lineTo(sufuriaScreenX + obstacle.width + 10, obstacle.y + obstacle.height/2);
          this.ctx.stroke();
        }
      }
    });
    
    // Draw chapatis and collectibles
    this.level.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        const collectibleScreenX = collectible.x - this.gameState.scrollX;
        
        if (
          collectibleScreenX + collectible.width > 0 &&
          collectibleScreenX < this.canvas.width
        ) {
          if (collectible.type === 'chapati') {
            // Draw chapati
            this.ctx.fillStyle = '#FFC107';
            this.ctx.beginPath();
            this.ctx.arc(
              collectibleScreenX + collectible.width/2,
              collectible.y + collectible.height/2,
              collectible.width/2,
              0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Add some detail to chapati
            this.ctx.fillStyle = '#E6AB09';
            this.ctx.beginPath();
            this.ctx.arc(
              collectibleScreenX + collectible.width/2,
              collectible.y + collectible.height/2,
              collectible.width/4,
              0, Math.PI * 2
            );
            this.ctx.fill();
          } else if (collectible.type === 'vote') {
            // Draw vote ballot
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(collectibleScreenX, collectible.y, collectible.width, collectible.height);
            
            // Draw X mark
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(collectibleScreenX + 5, collectible.y + 5);
            this.ctx.lineTo(collectibleScreenX + collectible.width - 5, collectible.y + collectible.height - 5);
            this.ctx.moveTo(collectibleScreenX + collectible.width - 5, collectible.y + 5);
            this.ctx.lineTo(collectibleScreenX + 5, collectible.y + collectible.height - 5);
            this.ctx.stroke();
          }
        }
      }
    });
    
    // Draw enemies
    this.level.enemies.forEach(enemy => {
      const enemyScreenX = enemy.x - this.gameState.scrollX;
      
      if (
        enemyScreenX + enemy.width > 0 &&
        enemyScreenX < this.canvas.width
      ) {
        // Draw enemy body (Riggy G)
        this.ctx.fillStyle = '#B22222';
        this.ctx.fillRect(enemyScreenX, enemy.y, enemy.width, enemy.height);
        
        // Draw enemy face
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(
          enemyScreenX + (enemy.direction === 1 ? 15 : 5),
          enemy.y + 10,
          40,
          30
        );
        
        // Draw enemy eyes
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(
          enemyScreenX + (enemy.direction === 1 ? 25 : 15),
          enemy.y + 20,
          3, 0, Math.PI * 2
        );
        this.ctx.arc(
          enemyScreenX + (enemy.direction === 1 ? 35 : 35),
          enemy.y + 20,
          3, 0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw enemy mouth
        this.ctx.beginPath();
        this.ctx.arc(
          enemyScreenX + (enemy.direction === 1 ? 30 : 25),
          enemy.y + 30,
          5,
          0, Math.PI
        );
        this.ctx.stroke();
        
        // Draw speech bubble if showing message
        if (enemy.showingMessage) {
          this.ctx.fillStyle = 'white';
          this.ctx.beginPath();
          this.ctx.arc(
            enemyScreenX + enemy.width/2,
            enemy.y - 30,
            50, 0, Math.PI * 2
          );
          this.ctx.fill();
          
          // Draw speech bubble pointer
          this.ctx.beginPath();
          this.ctx.moveTo(enemyScreenX + enemy.width/2, enemy.y - 10);
          this.ctx.lineTo(enemyScreenX + enemy.width/2 + 10, enemy.y - 10);
          this.ctx.lineTo(enemyScreenX + enemy.width/2, enemy.y);
          this.ctx.closePath();
          this.ctx.fillStyle = 'white';
          this.ctx.fill();
          
          // Draw text
          this.ctx.fillStyle = 'black';
          this.ctx.font = '10px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('Tuwache Mchezo!', enemyScreenX + enemy.width/2, enemy.y - 30);
        }
      }
    });
    
    // Draw matatu stage (finish line)
    const matatuScreenX = this.level.finish.x - this.gameState.scrollX;
    if (
      matatuScreenX + this.level.finish.width > 0 &&
      matatuScreenX < this.canvas.width
    ) {
      // Draw matatu stage platform
      this.ctx.fillStyle = '#666666';
      this.ctx.fillRect(matatuScreenX, this.level.finish.y + this.level.finish.height - 10, this.level.finish.width, 10);
      
      // Draw matatu vehicle
      this.ctx.fillStyle = '#FF6347';
      this.ctx.fillRect(matatuScreenX + 10, this.level.finish.y, this.level.finish.width - 20, this.level.finish.height - 10);
      
      // Draw matatu windows
      this.ctx.fillStyle = '#87CEEB';
      this.ctx.fillRect(matatuScreenX + 20, this.level.finish.y + 10, 25, 20);
      this.ctx.fillRect(matatuScreenX + 55, this.level.finish.y + 10, 35, 20);
      
      // Draw matatu wheels
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(matatuScreenX + 30, this.level.finish.y + this.level.finish.height - 10, 10, 0, Math.PI * 2);
      this.ctx.arc(matatuScreenX + this.level.finish.width - 30, this.level.finish.y + this.level.finish.height - 10, 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw sign
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(matatuScreenX + this.level.finish.width/2 - 30, this.level.finish.y - 40, 60, 30);
      
      this.ctx.fillStyle = 'black';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('FINISH', matatuScreenX + this.level.finish.width/2, this.level.finish.y - 20);
    }
    
    // Draw player
    this.player.draw(this.ctx, this.gameState.scrollX);
  }
}

// Export the function to initialize the game
export function initGame(container: HTMLDivElement): void {
  new GameEngine(container);
}
