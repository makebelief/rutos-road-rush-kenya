
import { Sprite } from './sprite';

// Player character class
export class Player extends Sprite {
  isJumping: boolean;
  isOnGround: boolean;
  animationFrame: number;
  animationCounter: number;
  direction: number; // 1 = right, -1 = left
  lives: number;
  
  // Constants
  private readonly GRAVITY = 0.5;
  private readonly JUMP_FORCE = -13;
  private readonly MOVE_SPEED = 5;
  
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.isJumping = false;
    this.isOnGround = false;
    this.animationFrame = 0;
    this.animationCounter = 0;
    this.direction = 1;
    this.lives = 3;
  }
  
  override update(time?: number) {
    // Apply gravity
    this.velocityY += this.GRAVITY;
    
    // Update position
    super.update(time);
    
    // Animation counter
    this.animationCounter++;
    if (this.animationCounter > 6) {
      this.animationFrame = (this.animationFrame + 1) % 4; // 4 frames animation
      this.animationCounter = 0;
    }
  }
  
  moveLeft() {
    this.velocityX = -this.MOVE_SPEED;
    this.direction = -1;
  }
  
  moveRight() {
    this.velocityX = this.MOVE_SPEED;
    this.direction = 1;
  }
  
  stopMoving() {
    this.velocityX = 0;
  }
  
  jump() {
    if (this.isOnGround) {
      this.velocityY = this.JUMP_FORCE;
      this.isJumping = true;
      this.isOnGround = false;
      // Play jump sound (would be implemented in the game class)
      return true;
    }
    return false;
  }
  
  land() {
    this.isOnGround = true;
    this.isJumping = false;
    this.velocityY = 0;
  }
  
  loseLife() {
    this.lives--;
    return this.lives <= 0;
  }
  
  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isOnGround = true;
    this.isJumping = false;
  }
  
  draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    const playerScreenX = this.x - scrollX;
    
    // Draw player body
    ctx.fillStyle = '#228B22';
    ctx.fillRect(playerScreenX, this.y, this.width, this.height);
    
    // Draw player clothing
    ctx.fillStyle = '#B22222';
    ctx.fillRect(playerScreenX, this.y + this.height * 0.3, this.width, this.height * 0.7);
    
    // Draw player head
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(
      playerScreenX + this.width/2,
      this.y + 15,
      15, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw player eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(
      playerScreenX + (this.direction === 1 ? this.width/2 + 5 : this.width/2 - 5),
      this.y + 12,
      3, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(
      playerScreenX + (this.direction === 1 ? this.width/2 + 5 : this.width/2 - 5),
      this.y + 12,
      1.5, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw player mouth
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(
      playerScreenX + (this.direction === 1 ? this.width/2 + 3 : this.width/2 - 3),
      this.y + 20,
      2, 0, Math.PI
    );
    ctx.fill();
    
    // Draw legs with animation
    if (this.velocityX !== 0 && this.isOnGround) {
      // Running animation
      const legSpread = Math.sin(this.animationFrame * Math.PI / 2) * 10;
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(
        playerScreenX + this.width/2 - 10 - legSpread,
        this.y + this.height * 0.7,
        8,
        this.height * 0.3
      );
      ctx.fillRect(
        playerScreenX + this.width/2 + 2 + legSpread,
        this.y + this.height * 0.7,
        8,
        this.height * 0.3
      );
    } else {
      // Standing still
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(
        playerScreenX + this.width/2 - 10,
        this.y + this.height * 0.7,
        8,
        this.height * 0.3
      );
      ctx.fillRect(
        playerScreenX + this.width/2 + 2,
        this.y + this.height * 0.7,
        8,
        this.height * 0.3
      );
    }
    
    // Draw arms
    ctx.fillStyle = '#228B22';
    ctx.fillRect(
      playerScreenX + (this.direction === 1 ? this.width - 5 : -10),
      this.y + this.height * 0.3,
      15,
      8
    );
    
    // Draw hat
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(
      playerScreenX + this.width/2,
      this.y + 10,
      12,
      Math.PI, Math.PI * 2
    );
    ctx.fill();
    ctx.fillRect(
      playerScreenX + this.width/2 - 15,
      this.y + 10,
      30,
      5
    );
  }
}
