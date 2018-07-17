const debugLog = true;

const times = [];
var fps;

const playerSpeed = 10;
const maxVel = 10;
const friction = 0.96;

const leftN = [-1, 0];
const rightN = [1, 0];
const upN = [0, 1];
const downN = [0, -1];

var walls = [];
var enemies = [];
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

class GameObject {
  constructor(x, y, h, w, c) {
    this.position = [x,y];
    this.size = [h,w];
    
    this.fillstyle = c;
  }
  
  draw() {
    ctx.fillStyle = this.fillstyle;
    ctx.fillRect(this.position[0],
                 this.position[1],
                 this.size[0],
                 this.size[1]);
  }
}

class Character extends GameObject {
  constructor(x, y, h, w, c) {
    super(x, y, h, w, c);
    
    this.velocity = [0,0];
    this.acceleration = [0,1];
    this.newPosition = [x,y];
  
    this.isJump = false;
    this.isWall = false;
    this.reverseX = 1;
  }
  
  move() {
    console.log("move");
  }
  
  checkCollide(obj) {
    return  !( this.newPosition[1] + this.size[1] < obj.position[1] ||
         this.newPosition[1] > obj.position[1] + obj.size[1] ||
         this.newPosition[0] > obj.position[0] + obj.size[0] ||
         this.newPosition[0] + this.size[0] < obj.position[0] );
  }
  
  velocityAndFriction() {
    if (!this.isJump) {
      if(this.velocity[0] < 3 && this.velocity[0] > -3) {
        if (this.velocity[0] < 0) 
          this.velocity[0] = Math.ceil(this.velocity[0] * friction * 10) / 10;
        else 
          this.velocity[0] = Math.floor(this.velocity[0] * friction * 10) / 10;
        if( this.velocity[0] <= 0.2 && this.velocity[0] >= -0.2 )
          this.velocity[0] = 0;
      } else {
        this.velocity[0] = Math.round(this.velocity[0] * friction * 100) / 100;
      }
    }
      
    if ( this.velocity[0] > 10  ) this.velocity[0] = 10;
    if ( this.velocity[0] < -10 ) this.velocity[0] = -10;
  }
  
  checkValidMove() {
    this.isJump = true;
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
        this.handleCollide2(w);
    });    
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
      if (this.isJump) this.isWall = true;
      
    } else {
      if(collideVector[1] < 0) {
        this.newPosition[1] -= this.newPosition[1] + this.size[1] - obj.position[1];
        this.isJump = false; 
      }
      else {
        this.newPosition[1] += obj.position[1] + obj.size[1] - this.newPosition[1];
      }
      this.velocity[1] = 0;
      
    }
  }

  handleCollide2(obj) {
    let deltaY = 100, deltaX = 0;

    
    if (this.velocity[0] < 0) {
      deltaX = obj.position[0] + obj.size[0] - this.newPosition[0];

    } else {
      deltaX = obj.position[0] - (this.newPosition[0] + this.size[0]);
    }
  
    
    if (this.velocity[1] > 0) {
      deltaY = this.newPosition[1] + this.size[1] - obj.position[1];
    } else {
      deltaY = this.newPosition[1] - (obj.position[1] + obj.size[1]);
    }

    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      this.newPosition[0] += deltaX + 0.01;
      this.velocity[0] = 0;
    } else if (Math.abs(deltaY) < Math.abs(deltaX)) {
      this.newPosition[1] -= deltaY + 0.01;
      this.velocity[1] = 0;
    }
  }  

}

class Enemy extends Character {
  constructor(x, y, h, w) {
    super(x, y, h, w, 'red');
  }
  
  move() {
    
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];
    
    this.velocityAndFriction();    
    this.newPosition = [this.position[0] + this.velocity[0],
                        this.position[1] + this.velocity[1] ];        
    this.checkValidMove();    
    this.position = this.newPosition;
  }
}

class Player extends Character{
  constructor(x, y, h, w) {
    super(x, y, h, w, 'green');  
  }
  
  move() {    
    let {x, y} = this.handleKeys();
    
    this.velocity[0] += x + this.acceleration[0];
    this.velocity[1] += y + this.acceleration[1];
    
    this.velocityAndFriction();    
    this.newPosition = [this.position[0] + this.velocity[0],
                        this.position[1] + this.velocity[1] ];        
    this.checkValidMove();
    this.checkEnemy();
    this.position = this.newPosition;      
  }
  
  checkEnemy() {
    this.fillstyle = 'green';
    enemies.forEach(e => {
      if (this.checkCollide(e)) 
        this.fillstyle = 'blue';      
    })
  }
  
  handleKeys() {
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
    
    return {x, y};

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
    else if (x == Key.RIGHT)
      return 'Right';
  });
  
  ctx.fillStyle = "red";
  ctx.font = "10px Arial";
  ctx.fillText("Player Speed: " + player.velocity, 10, 10);
  ctx.fillText("Player wall: "+ player.isWall, 10, 20);
  ctx.fillText("Player Jump: " + player.isJump, 10, 30);
  ctx.fillText("Keys Hit: " + k , 10, 40);
  ctx.fillText("FPS: " + fps, 10, 50);  
}

function loadLevel() {
  walls.push(new GameObject(0, 0, 40, 720, 'black'));         //Far left wall
  walls.push(new GameObject(1240, 0 , 40, 720, 'black'));     //Far right wall
  walls.push(new GameObject(40, 680, 1200, 40, 'black'));      //Bottom wall
}

function loadEnemies() {
  enemies.push(new Enemy(500, 620, 50, 50));
  enemies.push(new Enemy(500, 100, 50, 50));
}

function loop() {
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  fps = times.length;
  control();
  redraw();
  requestAnimationFrame(loop);
}

function redraw() {
  ctx.clearRect(0,0,1280,720);
  walls.forEach(w => {
    w.draw();
  });
  enemies.forEach(e => {
    e.draw();
  })
  player.draw();  
  if (debugLog) {
    debugDraw()
  }
}

function control() {
  player.move();
  enemies.forEach(e => {
    e.move();
  });
}

function main() {
  player = new Player(50,40,40,40);
  loadEnemies();
  loadLevel();
  loop();
}