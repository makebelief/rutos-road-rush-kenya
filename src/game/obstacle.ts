
import { Sprite } from './sprite';

// Class for obstacles (potholes, flying sufurias, etc.)
export class Obstacle extends Sprite {
  type: string;
  active: boolean;
  // For moving obstacles
  startY: number;
  
  constructor(x: number, y: number, width: number, height: number, type: string = 'pothole') {
    super(x, y, width, height);
    this.type = type;
    this.active = true;
    this.velocityY = 0;
    this.startY = y;
    
    // Setup based on type
    if (type === 'sufuria') {
      this.velocityY = -5; // Flying upward initially
    }
  }
  
  update() {
    // Update position
    super.update();
    
    // Special behavior for different obstacle types
    if (this.type === 'sufuria') {
      // Apply gravity to sufuria
      this.velocityY += 0.2;
      
      // Reset if out of view
      if (this.y > this.startY + 300) {
        this.y = this.startY;
        this.velocityY = -5;
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    const screenX = this.x - scrollX;
    
    if (screenX + this.width > 0 && screenX < ctx.canvas.width) {
      if (this.type === 'pothole') {
        // Draw pothole
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(
          screenX + this.width/2,
          this.y + this.height/2,
          this.width/2,
          this.height/2,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add some depth to pothole
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.ellipse(
          screenX + this.width/2,
          this.y + this.height/2,
          this.width/3,
          this.height/3,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      } else if (this.type === 'sufuria') {
        // Draw sufuria (cooking pot)
        // Main pot
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.ellipse(
          screenX + this.width/2,
          this.y + this.height/2,
          this.width/2,
          this.height/3,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Handle
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(screenX + this.width - 5, this.y + this.height/3);
        ctx.lineTo(screenX + this.width + 10, this.y + this.height/2);
        ctx.stroke();
      }
    }
  }
}
