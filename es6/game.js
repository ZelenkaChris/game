var player;


function main() {
  player = new Player(10,10,50,50);

  loop();
}

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

class Player {
  constructor(x, y, h, w) {
    this.position = [x,y];
    this.size = [h,w];
    this.velocity = [0,0];
    this.fillstyle = 'green';
  }
  
  draw() {
    ctx.fillStyle = this.fillstyle;
    ctx.fillRect(this.position[0],
                 this.position[1],
                 this.size[0],
                 this.size[1]);
  }
  
  move(x, y) {
    this.position[0] += x;
    this.position[1] += y;
  }  
}


function redraw() {
  ctx.clearRect(0,0,1280,720);
  player.draw();
}

function control() {
  player.move(1,1);
}