'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var playerSpeed = 10;

var player;

var Key = {
  pressed: {},

  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,

  isDown: function isDown(keyCode) {
    return this.pressed[keyCode];
  },

  onKeydown: function onKeydown(event) {
    this.pressed[event.keyCode] = true;
  },

  onKeyup: function onKeyup(event) {
    delete this.pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function (event) {
  Key.onKeydown(event);
}, false);

var Player = function () {
  function Player(x, y, h, w) {
    _classCallCheck(this, Player);

    this.position = [x, y];
    this.size = [h, w];
    this.velocity = [0, 0];
    this.acceleration = [0, 1];
    this.fillstyle = 'green';
    this.isJump = false;
  }

  _createClass(Player, [{
    key: 'draw',
    value: function draw() {
      ctx.fillStyle = this.fillstyle;
      ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
    }
  }, {
    key: 'move',
    value: function move(x, y) {
      this.velocity[0] = x;
      this.velocity[1] += y + this.acceleration[1];
      this.position[0] += this.velocity[0];
      this.position[1] += this.velocity[1];
    }
  }]);

  return Player;
}();

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

function redraw() {
  ctx.clearRect(0, 0, 1280, 720);
  player.draw();
}

function playerMove() {
  var x = 0;
  var y = 0;
  if (Key.isDown(Key.UP) && !player.isJump) {
    y += -playerSpeed * 3;
    player.isJump = true;
  }
  if (Key.isDown(Key.LEFT)) {
    x += -playerSpeed;
  }
  if (Key.isDown(Key.RIGHT)) {
    x += playerSpeed;
  }

  player.move(x, y);
}

function checkValidMove() {
  if (player.position[0] < 0) {
    player.position[0] = 0;
  }
  if (player.position[0] + player.size[0] > 1280) {
    player.position[0] = 1280 - player.size[0];
  }

  if (player.position[1] < 0) {
    player.position[1] = 0;
  }
  if (player.position[1] + player.size[1] > 720) {
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
  player = new Player(10, 10, 50, 50);
  loop();
}