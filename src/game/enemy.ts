
import { Sprite } from './sprite';

// Class for enemy characters
export class Enemy extends Sprite {
  direction: number; // 1 = right, -1 = left
  moveRange: number;
  startX: number;
  speed: number;
  active: boolean;
  showingMessage: boolean;
  messageTimer: number;
  enemyType: string;
  
  constructor(x: number, y: number, width: number, height: number, moveRange = 200, speed = 2, enemyType = 'riggy') {
    super(x, y, width, height);
    this.direction = -1;
    this.moveRange = moveRange;
    this.startX = x;
    this.speed = speed;
    this.active = true;
    this.showingMessage = false;
    this.messageTimer = 0;
    this.enemyType = enemyType;
  }
  
  override update(time?: number) {
    super.update(time);
    
    if (this.active) {
      // Move enemy back and forth
      this.x += this.speed * this.direction;
      
      // Change direction if reached movement limit
      if (
        this.x <= this.startX - this.moveRange ||
        this.x >= this.startX + this.moveRange
      ) {
        this.direction *= -1;
      }
      
      // Update message timer
      if (this.showingMessage) {
        this.messageTimer--;
        if (this.messageTimer <= 0) {
          this.showingMessage = false;
        }
      }
    }
  }
  
  showMessage() {
    this.showingMessage = true;
    this.messageTimer = 60; // Show for 60 frames
  }
  
  draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    const screenX = this.x - scrollX;
    
    if (screenX + this.width > 0 && screenX < ctx.canvas.width) {
      if (this.enemyType === 'riggy') {
        // Draw enemy body (Riggy G)
        ctx.fillStyle = '#B22222';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Draw enemy face
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(
          screenX + (this.direction === 1 ? 15 : 5),
          this.y + 10,
          40,
          30
        );
        
        // Draw enemy eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(
          screenX + (this.direction === 1 ? 25 : 15),
          this.y + 20,
          3, 0, Math.PI * 2
        );
        ctx.arc(
          screenX + (this.direction === 1 ? 35 : 35),
          this.y + 20,
          3, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Draw enemy mouth
        ctx.beginPath();
        ctx.arc(
          screenX + (this.direction === 1 ? 30 : 25),
          this.y + 30,
          5,
          0, Math.PI
        );
        ctx.stroke();
        
        // Draw speech bubble if showing message
        if (this.showingMessage) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(
            screenX + this.width/2,
            this.y - 30,
            50, 0, Math.PI * 2
          );
          ctx.fill();
          
          // Draw speech bubble pointer
          ctx.beginPath();
          ctx.moveTo(screenX + this.width/2, this.y - 10);
          ctx.lineTo(screenX + this.width/2 + 10, this.y - 10);
          ctx.lineTo(screenX + this.width/2, this.y);
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
          
          // Draw text
          ctx.fillStyle = 'black';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Tuwache Mchezo!', screenX + this.width/2, this.y - 30);
        }
      }
    }
  }
}
