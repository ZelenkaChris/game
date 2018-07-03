const playerSpeed = 10;

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

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

class Player {
  constructor(x, y, h, w) {
    this.position = [x,y];
    this.size = [h,w];
    this.velocity = [0,0];
    this.acceleration = [0,1];
    this.fillstyle = 'green';
    this.isJump = false;
  }
  
  draw() {
    ctx.fillStyle = this.fillstyle;
    ctx.fillRect(this.position[0],
                 this.position[1],
                 this.size[0],
                 this.size[1]);
  }
  
  move(x, y) {
    this.velocity[0] = x;
    this.velocity[1] += y + this.acceleration[1];
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
  }
}

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

function redraw() {
  ctx.clearRect(0,0,1280,720);
  player.draw();
}

function playerMove() {
  let x = 0;
  let y = 0;
  if ( Key.isDown(Key.UP) && !player.isJump) {
    y += -playerSpeed * 3;
    player.isJump = true;
  }
  if ( Key.isDown(Key.LEFT) ) {
    x += -playerSpeed;
  }
  if ( Key.isDown(Key.RIGHT) ) {
    x += playerSpeed;
  }
  
  player.move(x,y);
}

function checkValidMove() {
  if ( player.position[0] < 0 ) {
    player.position[0] = 0;
  }
  if ( player.position[0] + player.size[0] > 1280 ) {
    player.position[0] = 1280 - player.size[0];
  }
  
  if ( player.position[1] < 0 ) {
    player.position[1] = 0;
  }
  if ( player.position[1] + player.size[1] > 720 ) {
    player.position[1] = 720 - player.size[1];
    player.velocity[1] = 0;
    player.isJump = false;
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

