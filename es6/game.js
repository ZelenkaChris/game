const debugLog = true;

const playerSpeed = 10;
const maxVel = 10;
const friction = 0.96;

var walls = [];


var player;

var Key = {
    pressed: {},

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
  
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },
  
    onKeydown: function(event) {
        this.pressed[event.keyCode] = true;
    },
  
    onKeyup: function(event) {
        delete this.pressed[event.keyCode];
    }
};

document.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
document.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

class Wall {
  constructor(x, y, h, w){
    this.position = [x,y];
    this.size = [h,w];
    this.fillstyle = 'black';
  }
  
  draw() {
    ctx.fillStyle = this.fillstyle;
    ctx.fillRect(this.position[0],
                 this.position[1],
                 this.size[0],
                 this.size[1]);
  }
}


function loadLevel() {
  walls.push(new Wall(800, 600, 120, 120));
  walls.push(new Wall(500, 400, 120, 120));
}

class Player {
  constructor(x, y, h, w) {
    this.position = [x,y];
    this.newPosition = [x,y];
    this.size = [h,w];
    this.velocity = [0,0];
    this.acceleration = [0,1];
    this.fillstyle = 'green';
    
    this.isJump = false;
    this.isWall = false;
    this.reverseX = 1;
    
    this.reverseCount = 0;
  }
  
  draw() {
    ctx.fillStyle = this.fillstyle;
    ctx.fillRect(this.position[0],
                 this.position[1],
                 this.size[0],
                 this.size[1]);
  }
  
  move() {
    let x = 0;
    let y = 0;
    
    if ( Key.isDown(Key.UP) ) {
      if (!this.isJump) {
        y += -playerSpeed * 2;
        this.isJump = true;
      } else if (this.isWall) {
        y += -playerSpeed * 2;
        this.velocity[1] = 0;
        this.velocity[0] = 6 * this.reverseX;
      }
    }  

    if ( Key.isDown(Key.LEFT) ) {
      this.acceleration[0] = -0.5;
    }
    if ( Key.isDown(Key.RIGHT) ) {
      this.acceleration[0] = 0.5;
    }
    if ( (Key.isDown(Key.RIGHT) && Key.isDown(Key.LEFT)) || (!Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT))){
      this.acceleration[0] = 0
    }
    
    this.velocity[0] += x + this.acceleration[0];
    this.velocity[1] += y + this.acceleration[1];
    
    
    if (!this.isJump) {
      if(this.velocity[0] < 3 && this.velocity[0] > -3) {
        if (this.velocity[0] < 0) 
          this.velocity[0] = Math.ceil(this.velocity[0] * friction * 10) / 10;
        else 
          this.velocity[0] = Math.floor(this.velocity[0] * friction * 10) / 10;
        if( this.velocity[0] <= 0.2 && this.velocity[0] >= -0.2 )
          this.velocity[0] = 0;
      } else 
        this.velocity[0] = Math.round(this.velocity[0] * friction * 100) / 100;
      
    }
      
    
    if ( this.velocity[0] > 10 ) {
      this.velocity[0] = 10;
    }
    if (this.velocity[0] < -10 ) {
      this.velocity[0] = -10;
    }
    
    this.newPosition = [this.position[0] + this.velocity[0],
                        this.position[1] + this.velocity[1] ];
    
    
    this.checkValidMove();
    
    this.position = this.newPosition;
      
  }
  
  checkValidMove() {
    if ( this.newPosition[0] < 0 ) {
      this.newPosition[0] = 0;
      this.velocity[0] = 0;
      this.isWall = true;
      this.reverseX = 1;
    } else  if ( this.newPosition[0] + this.size[0] > 1280 ) {
      this.newPosition[0] = 1280 - this.size[0];
      this.velocity[0] = 0;
      this.isWall = true;
      this.reverseX = -1;
    } else {
      this.isWall = false;
    }

    if ( this.newPosition[1] < 0 ) {
      this.newPosition[1] = 0;
      this.velocity[1] = 0;
    }
    if ( this.newPosition[1] + this.size[1] > 720 ) {
      this.newPosition[1] = 720 - this.size[1];
      this.velocity[1] = 0;
      this.isJump = false;
      this.isWall = false;
    }
    
    walls.forEach(w =>{
      if (this.checkCollide(w))
        this.handleCollide(w);
    });
    
  }
  
  checkCollide(obj) {
    return  !( this.newPosition[1] + this.size[1] < obj.position[1] ||
         this.newPosition[1] > obj.position[1] + obj.size[1] ||
         this.newPosition[0] > obj.position[0] + obj.size[0] ||
         this.newPosition[0] + this.size[0] < obj.position[0] );
  }
  
  handleCollide(obj) {

    let playerCenter = [this.newPosition[0] + this.size[0]/2, this.newPosition[1] + this.size[1]/2];
    let objCenter = [obj.position[0] + obj.size[0]/2, obj.position[1] + obj.size[1]/2]
    
    let collideVector = [playerCenter[0] - objCenter[0], playerCenter[1] - objCenter[1]];
    
    if (Math.abs(collideVector[0]) > Math.abs(collideVector[1])){
      if(collideVector[0] < 0) {
        this.newPosition[0] -= this.newPosition[0] + this.size[0] - obj.position[0] + 0.01;
        this.reverseX = -1; 
      }
      else {
        this.newPosition[0] += obj.position[0] + obj.size[0] - this.newPosition[0] - 0.01; 
        this.reverseX = 1;
      }
      
      this.velocity[0] = 0;
      
      if (this.isJump)
        this.isWall = true;
      
    } else {
      if(collideVector[1] < 0) {
        this.newPosition[1] -= this.newPosition[1] + this.size[1] - obj.position[1];
        this.isJump = false; 
      }
      else 
        this.newPosition[1] += obj.position[1] + obj.size[1] - this.newPosition[1];
      
      this.velocity[1] = 0;
      
    }
  }
  
}

function debugDraw() {

  let k = Object.keys(Key.pressed).map( x => {
    if (x == Key.UP)
      return 'Up';
    else if (x == Key.DOWN)
      return 'Down';
    else if (x == Key.LEFT)
      return 'Left';
    else
      return 'Right';
  })
  
  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  ctx.fillText("Player Speed: " + player.velocity, 10, 10);
  ctx.fillText("Player wall: "+ player.isWall, 10, 20);
  ctx.fillText("Keys Hit: " + k, 10, 30);
  
}

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

function redraw() {
  ctx.clearRect(0,0,1280,720);
  walls.forEach(w => {
    w.draw();
  });
  player.draw();
  
  if (debugLog) {
    debugDraw()
  }
}

function control() {
  player.move();
}

function main() {
  player = new Player(10,10,50,50);
  loadLevel();
  loop();
}