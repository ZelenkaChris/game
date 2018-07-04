const debugLog = true;

const playerSpeed = 10;
const maxVel = 10;
const friction = 0.96;


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

class Player {
  constructor(x, y, h, w) {
    this.position = [x,y];
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
  
  move(x, y) {
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
    
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
  }
}

function debugDraw() {
  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  ctx.fillText("Player Speed: " + player.velocity, 10, 10);
  ctx.fillText("Player wall: "+ player.isWall, 10, 20);
  
}

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

function redraw() {
  ctx.clearRect(0,0,1280,720);
  player.draw();
  
  if (debugLog) {
    debugDraw()
  }
}

function playerMove() {
  let x = 0;
  let y = 0;
  
  if ( Key.isDown(Key.UP) ) {
    if (!player.isJump) {
      y += -playerSpeed * 2;
      player.isJump = true;
    } else if (player.isWall) {
      y += -playerSpeed * 2;
      player.velocity[1] = 0;
      player.velocity[0] = 8 * player.reverseX;
    }
  }  
  
  if ( Key.isDown(Key.LEFT) ) {
    player.acceleration[0] = -0.5;
  }
  if ( Key.isDown(Key.RIGHT) ) {
    player.acceleration[0] = 0.5;
  }
  if ( (Key.isDown(Key.RIGHT) && Key.isDown(Key.LEFT)) || (!Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT))){
    player.acceleration[0] = 0
  }
  
  player.move(x,y);
}

function checkValidMove() {
  if ( player.position[0] < 0 ) {
    player.position[0] = 0;
    player.velocity[0] = 0;
    player.isWall = true;
    player.reverseX = 1;
  } else  if ( player.position[0] + player.size[0] > 1280 ) {
    player.position[0] = 1280 - player.size[0];
    player.velocity[0] = 0;
    player.isWall = true;
    player.reverseX = -1;
  } else {
    player.isWall = false;
  }
  
  if ( player.position[1] < 0 ) {
    player.position[1] = 0;
    player.velocity[1] = 0;
  }
  if ( player.position[1] + player.size[1] > 720 ) {
    player.position[1] = 720 - player.size[1];
    player.velocity[1] = 0;
    player.isJump = false;
    player.isWall = false;
  }
}

function control() {
  playerMove();
  checkValidMove();
}

function main() {
  player = new Player(10,10,50,50);
  loop();
}