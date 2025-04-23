
// Base class for game sprites
export class Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  image: HTMLImageElement | null;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.image = null;
  }

  update(time?: number) {
    // Base update method
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    // Default drawing method
    const screenX = this.x - scrollX;
    
    if (this.image) {
      ctx.drawImage(this.image, screenX, this.y, this.width, this.height);
    } else {
      // Fallback if no image is available
      ctx.fillStyle = "purple";
      ctx.fillRect(screenX, this.y, this.width, this.height);
    }
  }

  // Collision detection
  isCollidingWith(other: Sprite): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}
