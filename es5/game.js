'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var player;

function main() {
  player = new Player(10, 10, 50, 50);

  loop();
}

function loop() {
  control();
  redraw();
  requestAnimationFrame(loop);
}

var Player = function () {
  function Player(x, y, h, w) {
    _classCallCheck(this, Player);

    this.position = [x, y];
    this.size = [h, w];
    this.velocity = [0, 0];
    this.fillstyle = 'green';
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
      this.position[0] += x;
      this.position[1] += y;
    }
  }]);

  return Player;
}();

function redraw() {
  ctx.clearRect(0, 0, 1280, 720);
  player.draw();
}

function control() {
  player.move(1, 1);
}