'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debugLog = true;

var times = [];
var fps;

var playerSpeed = 10;
var maxVel = 10;
var maxDrop = 39;
var friction = 0.96;

var leftN = [-1, 0];
var rightN = [1, 0];
var upN = [0, 1];
var downN = [0, -1];

var walls = [];
var enemies = [];
var player;

var levelSize = [1280 * 2, 720 * 5];

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

document.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);
document.addEventListener('keydown', function (event) {
  Key.onKeydown(event);
}, false);

var GameObject = function () {
  function GameObject(x, y, h, w, c) {
    _classCallCheck(this, GameObject);

    this.position = [x, y];
    this.size = [h, w];

    this.fillstyle = c;
  }

  _createClass(GameObject, [{
    key: 'draw',
    value: function draw() {
      ctx.fillStyle = this.fillstyle;
      ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
    }
  }]);

  return GameObject;
}();

var Character = function (_GameObject) {
  _inherits(Character, _GameObject);

  function Character(x, y, h, w, c) {
    _classCallCheck(this, Character);

    var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, x, y, h, w, c));

    _this.velocity = [0, 0];
    _this.acceleration = [0, 1];
    _this.newPosition = [x, y];

    _this.isJump = false;
    _this.isWall = false;
    _this.reverseX = 1;
    return _this;
  }

  _createClass(Character, [{
    key: 'move',
    value: function move() {
      console.log("move");
    }
  }, {
    key: 'checkCollide',
    value: function checkCollide(obj) {
      return !(this.newPosition[1] + this.size[1] < obj.position[1] || this.newPosition[1] > obj.position[1] + obj.size[1] || this.newPosition[0] > obj.position[0] + obj.size[0] || this.newPosition[0] + this.size[0] < obj.position[0]);
    }
  }, {
    key: 'velocityAndFriction',
    value: function velocityAndFriction() {
      if (!this.isJump) {
        if (this.velocity[0] < 3 && this.velocity[0] > -3) {
          if (this.velocity[0] < 0) this.velocity[0] = Math.ceil(this.velocity[0] * friction * 10) / 10;else this.velocity[0] = Math.floor(this.velocity[0] * friction * 10) / 10;
          if (this.velocity[0] <= 0.2 && this.velocity[0] >= -0.2) this.velocity[0] = 0;
        } else {
          this.velocity[0] = Math.round(this.velocity[0] * friction * 100) / 100;
        }
      }

      if (this.velocity[0] > maxVel) this.velocity[0] = maxVel;
      if (this.velocity[0] < -maxVel) this.velocity[0] = -maxVel;
      if (this.velocity[1] > maxDrop) this.velocity[1] = maxDrop;
    }
  }, {
    key: 'checkValidMove',
    value: function checkValidMove() {
      var _this2 = this;

      this.isJump = true;
      this.isWall = false;

      walls.forEach(function (w) {
        if (_this2.checkCollide(w)) _this2.handleCollide(w);
      });
    }
  }, {
    key: 'handleCollide',
    value: function handleCollide(obj) {
      var deltaY = 0,
          deltaX = 0,
          dis = 0.01;

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
        this.newPosition[0] += deltaX;
        if (deltaX > 0) this.newPosition[0] += dis;else this.newPosition[0] -= dis;
        this.velocity[0] = 0;
        if (deltaX > 0) this.reverseX = 1;else this.reverseX = -1;
        if (this.isJump) this.isWall = true;
      } else if (Math.abs(deltaY) < Math.abs(deltaX)) {
        this.newPosition[1] -= deltaY;
        this.velocity[1] = 0;
        if (deltaY > 0) {
          this.isJump = false;
        }
      }
    }
  }]);

  return Character;
}(GameObject);

var Enemy = function (_Character) {
  _inherits(Enemy, _Character);

  function Enemy(x, y, h, w) {
    _classCallCheck(this, Enemy);

    return _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, x, y, h, w, 'red'));
  }

  _createClass(Enemy, [{
    key: 'move',
    value: function move() {

      this.velocity[0] += this.acceleration[0];
      this.velocity[1] += this.acceleration[1];

      this.velocityAndFriction();
      this.newPosition = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
      this.checkValidMove();
      this.position = this.newPosition;
    }
  }]);

  return Enemy;
}(Character);

var Player = function (_Character2) {
  _inherits(Player, _Character2);

  function Player(x, y, h, w) {
    _classCallCheck(this, Player);

    return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, x, y, h, w, 'green'));
  }

  _createClass(Player, [{
    key: 'move',
    value: function move() {
      var _handleKeys = this.handleKeys(),
          x = _handleKeys.x,
          y = _handleKeys.y;

      this.velocity[0] += x + this.acceleration[0];
      this.velocity[1] += y + this.acceleration[1];

      this.velocityAndFriction();
      this.newPosition = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
      this.checkValidMove();
      this.checkEnemy();
      this.position = this.newPosition;
    }
  }, {
    key: 'checkEnemy',
    value: function checkEnemy() {
      var _this5 = this;

      this.fillstyle = 'green';
      enemies.forEach(function (e) {
        if (_this5.checkCollide(e)) _this5.fillstyle = 'blue';
      });
    }
  }, {
    key: 'handleKeys',
    value: function handleKeys() {
      var x = 0;
      var y = 0;

      if (Key.isDown(Key.UP)) {
        if (!this.isJump) {
          y += -playerSpeed * 2;
          this.isJump = true;
        } else if (this.isWall) {
          y += -playerSpeed * 2;
          this.velocity[1] = 0;
          this.velocity[0] = 6 * this.reverseX;
        }
      }

      if (Key.isDown(Key.LEFT)) {
        this.acceleration[0] = -0.5;
      }
      if (Key.isDown(Key.RIGHT)) {
        this.acceleration[0] = 0.5;
      }
      if (Key.isDown(Key.RIGHT) && Key.isDown(Key.LEFT) || !Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT)) {
        this.acceleration[0] = 0;
      }

      return { x: x, y: y };
    }
  }]);

  return Player;
}(Character);

function debugDraw(x, y) {

  var k = Object.keys(Key.pressed).map(function (b) {
    if (b == Key.UP) return 'Up';else if (b == Key.DOWN) return 'Down';else if (b == Key.LEFT) return 'Left';else if (b == Key.RIGHT) return 'Right';
  });

  ctx.fillStyle = 'rgba(100, 100, 100, 0.5';
  ctx.fillRect(10 - x, 5 - y, 175, 85);

  ctx.fillStyle = "red";
  ctx.font = "15px Arial";
  ctx.fillText("Player Speed: " + player.velocity, 20 - x, 20 - y);
  ctx.fillText("Player wall: " + player.isWall, 20 - x, 35 - y);
  ctx.fillText("Player Jump: " + player.isJump, 20 - x, 50 - y);
  ctx.fillText("Keys Hit: " + k, 20 - x, 65 - y);
  ctx.fillText("FPS: " + fps, 20 - x, 80 - y);
}

function loadLevel() {
  /*
  walls.push(new GameObject(0, 0, 40, 720*5, 'black'));                   //Far left wall
  walls.push(new GameObject(1240 * 2 + 40, 0 , 40, 720*5, 'black'));               //Far right wall
  walls.push(new GameObject(40, 680*5 + 160, 1200 * 2 + 80, 40, 'black'));         //Bottom wall
  walls.push(new GameObject(40, 0, 1200 * 2 + 80, 40, 'black'));                   //Top Wall
    walls.push(new GameObject(680, 560, 120, 120, 'black'));
  walls.push(new GameObject(480, 400, 120, 120, 'black'));
  */

}

function loadEnemies() {
  enemies.push(new Enemy(500, 620, 50, 50));
  enemies.push(new Enemy(500, 100, 50, 50));
}

function loop() {
  var now = performance.now();
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
  ctx.clearRect(0, 0, 1280 * 10, 720 * 10);
  ctx.save();

  var x = canvas.width / 2 - player.position[0];
  var y = canvas.height / 2 - player.position[1];

  if (x > 0) {
    x = 0;
  } else if (x < -(levelSize[0] - canvas.width)) {
    x = -(levelSize[0] - canvas.width);
  }

  if (y > 0) {
    y = 0;
  } else if (y < -(levelSize[1] - canvas.height)) {
    y = -(levelSize[1] - canvas.height);
  }

  ctx.translate(x, y);
  walls.forEach(function (w) {
    w.draw();
  });
  enemies.forEach(function (e) {
    e.draw();
  });
  player.draw();
  if (debugLog) {
    debugDraw(x, y);
  }
  ctx.restore();
}

function control() {
  player.move();
  enemies.forEach(function (e) {
    e.move();
  });
}

function main() {
  player = new Player(50, 40, 40, 40);
  loadEnemies();
  //loadLevel();
  loadMap();
  loop();
}