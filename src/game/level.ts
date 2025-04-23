
// Level class to manage platforms, collectibles, obstacles, and enemies
export class Level {
  width: number;
  groundHeight: number;
  platforms: any[];
  collectibles: any[];
  obstacles: any[];
  enemies: any[];
  finish: any;
  
  constructor(width: number, canvasHeight: number, groundHeight: number) {
    this.width = width;
    this.groundHeight = groundHeight;
    this.platforms = [];
    this.collectibles = [];
    this.obstacles = [];
    this.enemies = [];
    this.finish = null;
    
    // Initialize level
    this.createDefaultLevel(canvasHeight);
  }
  
  createDefaultLevel(canvasHeight: number) {
    // Create platforms
    this.platforms = [
      // Starting platforms
      { x: 300, y: canvasHeight - this.groundHeight - 100, width: 150, height: 20 },
      { x: 600, y: canvasHeight - this.groundHeight - 150, width: 150, height: 20 },
      { x: 900, y: canvasHeight - this.groundHeight - 200, width: 150, height: 20 },
      { x: 1200, y: canvasHeight - this.groundHeight - 150, width: 150, height: 20 },
      { x: 1500, y: canvasHeight - this.groundHeight - 100, width: 150, height: 20 },
      // More platforms...
      { x: 1800, y: canvasHeight - this.groundHeight - 180, width: 150, height: 20 },
      { x: 2100, y: canvasHeight - this.groundHeight - 120, width: 150, height: 20 },
      { x: 2400, y: canvasHeight - this.groundHeight - 200, width: 150, height: 20 },
      { x: 2700, y: canvasHeight - this.groundHeight - 150, width: 120, height: 20 },
      { x: 3000, y: canvasHeight - this.groundHeight - 180, width: 180, height: 20 },
      { x: 3300, y: canvasHeight - this.groundHeight - 120, width: 150, height: 20 },
      { x: 3600, y: canvasHeight - this.groundHeight - 220, width: 120, height: 20 },
      { x: 3900, y: canvasHeight - this.groundHeight - 160, width: 200, height: 20 },
      // Final platform (matatu stage)
      { x: 4700, y: canvasHeight - this.groundHeight - 50, width: 250, height: 50 },
    ];

    // Create chapatis (collectibles)
    const chapatiSize = 30;
    this.collectibles = [
      { x: 350, y: canvasHeight - this.groundHeight - 150, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 450, y: canvasHeight - this.groundHeight - 150, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 650, y: canvasHeight - this.groundHeight - 200, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 750, y: canvasHeight - this.groundHeight - 200, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 950, y: canvasHeight - this.groundHeight - 250, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 1050, y: canvasHeight - this.groundHeight - 250, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 1250, y: canvasHeight - this.groundHeight - 200, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 1550, y: canvasHeight - this.groundHeight - 150, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 1850, y: canvasHeight - this.groundHeight - 230, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 2150, y: canvasHeight - this.groundHeight - 170, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 2450, y: canvasHeight - this.groundHeight - 250, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 2750, y: canvasHeight - this.groundHeight - 200, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 3050, y: canvasHeight - this.groundHeight - 230, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 3350, y: canvasHeight - this.groundHeight - 170, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 3650, y: canvasHeight - this.groundHeight - 270, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
      { x: 3950, y: canvasHeight - this.groundHeight - 210, width: chapatiSize, height: chapatiSize, collected: false, type: 'chapati' },
    ];

    // Add some votes (special collectibles)
    const voteSize = 35;
    this.collectibles.push(
      { x: 1100, y: canvasHeight - this.groundHeight - 300, width: voteSize, height: voteSize, collected: false, type: 'vote' },
      { x: 2200, y: canvasHeight - this.groundHeight - 300, width: voteSize, height: voteSize, collected: false, type: 'vote' },
      { x: 3300, y: canvasHeight - this.groundHeight - 300, width: voteSize, height: voteSize, collected: false, type: 'vote' }
    );

    // Create potholes (obstacles)
    const potholeWidth = 100;
    const potholeHeight = 20;
    this.obstacles = [
      { x: 400, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 800, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 1300, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 1700, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 2200, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 2600, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 3100, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 3500, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 3900, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
      { x: 4300, y: canvasHeight - this.groundHeight, width: potholeWidth, height: potholeHeight, type: 'pothole' },
    ];

    // Add some flying sufurias
    const sufuriaSize = 40;
    this.obstacles.push(
      { x: 700, y: canvasHeight - this.groundHeight - 300, width: sufuriaSize, height: sufuriaSize, type: 'sufuria', velocityY: 0, startY: canvasHeight - this.groundHeight - 300 },
      { x: 1500, y: canvasHeight - this.groundHeight - 250, width: sufuriaSize, height: sufuriaSize, type: 'sufuria', velocityY: 0, startY: canvasHeight - this.groundHeight - 250 },
      { x: 2300, y: canvasHeight - this.groundHeight - 350, width: sufuriaSize, height: sufuriaSize, type: 'sufuria', velocityY: 0, startY: canvasHeight - this.groundHeight - 350 },
      { x: 3100, y: canvasHeight - this.groundHeight - 300, width: sufuriaSize, height: sufuriaSize, type: 'sufuria', velocityY: 0, startY: canvasHeight - this.groundHeight - 300 },
      { x: 3800, y: canvasHeight - this.groundHeight - 250, width: sufuriaSize, height: sufuriaSize, type: 'sufuria', velocityY: 0, startY: canvasHeight - this.groundHeight - 250 }
    );

    // Create enemies (Riggy G)
    this.enemies = [
      { 
        x: 1000, 
        y: canvasHeight - this.groundHeight - 60, 
        width: 60, 
        height: 60, 
        direction: -1, 
        moveRange: 200, 
        startX: 1000, 
        speed: 2, 
        active: true,
        popupTimer: 0,
        showingMessage: false,
        messageTimer: 0
      },
      { 
        x: 2000, 
        y: canvasHeight - this.groundHeight - 60, 
        width: 60, 
        height: 60, 
        direction: -1, 
        moveRange: 200, 
        startX: 2000, 
        speed: 2, 
        active: true,
        popupTimer: 0,
        showingMessage: false,
        messageTimer: 0
      },
      { 
        x: 3000, 
        y: canvasHeight - this.groundHeight - 60, 
        width: 60, 
        height: 60, 
        direction: -1, 
        moveRange: 200, 
        startX: 3000, 
        speed: 2, 
        active: true,
        popupTimer: 0,
        showingMessage: false,
        messageTimer: 0
      },
      { 
        x: 4000, 
        y: canvasHeight - this.groundHeight - 60, 
        width: 60, 
        height: 60, 
        direction: -1, 
        moveRange: 200, 
        startX: 4000, 
        speed: 2, 
        active: true,
        popupTimer: 0,
        showingMessage: false,
        messageTimer: 0
      },
    ];

    // Create finish line (matatu stage)
    this.finish = {
      x: 4800,
      y: canvasHeight - this.groundHeight - 100,
      width: 120,
      height: 100
    };
  }
}
