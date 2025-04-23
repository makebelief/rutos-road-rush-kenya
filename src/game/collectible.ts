
import { Sprite } from './sprite';

// Class for collectible items (chapatis, votes, etc.)
export class Collectible extends Sprite {
  collected: boolean;
  type: string;
  value: number;
  animationOffset: number;
  
  constructor(x: number, y: number, width: number, height: number, type: string = 'chapati') {
    super(x, y, width, height);
    this.collected = false;
    this.type = type;
    this.value = type === 'chapati' ? 100 : type === 'vote' ? 200 : 50;
    // Random starting point for floating animation
    this.animationOffset = Math.random() * Math.PI * 2;
  }
  
  // Override the base update method
  override update(time?: number) {
    super.update();
    
    if (!this.collected && time !== undefined) {
      // Floating animation
      this.y += Math.sin(time / 500 + this.animationOffset) * 0.5;
    }
  }
  
  collect() {
    if (!this.collected) {
      this.collected = true;
      return this.value;
    }
    return 0;
  }
  
  draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    if (!this.collected) {
      const screenX = this.x - scrollX;
      
      if (screenX + this.width > 0 && screenX < ctx.canvas.width) {
        if (this.type === 'chapati') {
          // Draw chapati
          ctx.fillStyle = '#FFC107';
          ctx.beginPath();
          ctx.arc(
            screenX + this.width/2,
            this.y + this.height/2,
            this.width/2,
            0, Math.PI * 2
          );
          ctx.fill();
          
          // Add some detail to chapati
          ctx.fillStyle = '#E6AB09';
          ctx.beginPath();
          ctx.arc(
            screenX + this.width/2,
            this.y + this.height/2,
            this.width/4,
            0, Math.PI * 2
          );
          ctx.fill();
        } else if (this.type === 'vote') {
          // Draw vote ballot
          ctx.fillStyle = 'white';
          ctx.fillRect(screenX, this.y, this.width, this.height);
          
          // Draw X mark
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screenX + 5, this.y + 5);
          ctx.lineTo(screenX + this.width - 5, this.y + this.height - 5);
          ctx.moveTo(screenX + this.width - 5, this.y + 5);
          ctx.lineTo(screenX + 5, this.y + this.height - 5);
          ctx.stroke();
        } else if (this.type === 'mandazi') {
          // Draw mandazi (triangle shape)
          ctx.fillStyle = '#D2691E';
          ctx.beginPath();
          ctx.moveTo(screenX + this.width/2, this.y);
          ctx.lineTo(screenX + this.width, this.y + this.height);
          ctx.lineTo(screenX, this.y + this.height);
          ctx.closePath();
          ctx.fill();
        }
        
        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(
          screenX + this.width/2 - this.width/5,
          this.y + this.height/2 - this.height/5,
          this.width/6,
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}
