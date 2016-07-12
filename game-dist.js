"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	var Random = (function () {
		function Random() {
			_classCallCheck(this, Random);
		}

		_createClass(Random, null, [{
			key: "get",
			value: function get(init, end) {
				return Math.floor(Math.random() * end) + init;
			}
		}]);

		return Random;
	})();

	var Food = (function () {
		function Food(x, y) {
			_classCallCheck(this, Food);

			this.x = x;
			this.y = y;
			this.height = 10;
			this.width = 10;
		}

		_createClass(Food, [{
			key: "draw",
			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		}], [{
			key: "generateFood",
			value: function generateFood() {
				return new Food(Random.get(0, 480), Random.get(0, 280));
			}
		}]);

		return Food;
	})();

	var Square = (function () {
		function Square(x, y) {
			_classCallCheck(this, Square);

			this.x = x;
			this.y = y;
			this.back = null;
			this.height = 10;
			this.width = 10;
		}

		_createClass(Square, [{
			key: "draw",
			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
				if (this.hasBack()) {
					this.back.draw();
				}
			}
		}, {
			key: "add",
			value: function add() {
				if (this.hasBack()) return this.back.add();
				this.back = new Square(this.x, this.y);
			}
		}, {
			key: "hasBack",
			value: function hasBack() {
				return this.back !== null;
			}
		}, {
			key: "right",
			value: function right() {
				this.copy();
				this.x += 10;
			}
		}, {
			key: "left",
			value: function left() {
				this.copy();
				this.x -= 10;
			}
		}, {
			key: "up",
			value: function up() {
				this.copy();
				this.y -= 10;
			}
		}, {
			key: "down",
			value: function down() {
				this.copy();
				this.y += 10;
			}
		}, {
			key: "copy",
			value: function copy() {
				if (this.hasBack()) {
					this.back.copy();

					this.back.x = this.x;
					this.back.y = this.y;
				}
			}
		}, {
			key: "hit",
			value: function hit(head) {
				var second = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				//The first and second are because can not be a hit between the first and second
				if (this === head && !this.hasBack()) return false;
				if (this === head) return this.back.hit(head, true);

				if (second && !this.hasBack()) return false;
				if (second) return this.back.hit(head);

				// Now there are more than 2
				if (this.hasBack()) {
					return squareHit(this, head) || this.back.hit(head);
				}

				//If you arrive here, we are checking the last
				return squareHit(this, head);
			}
		}, {
			key: "hitBorder",
			value: function hitBorder() {
				return this.x > 480 || this.x < 0 || this.y < 0 || this.y > 280;
			}
		}]);

		return Square;
	})();

	var Snake = (function () {
		function Snake() {
			_classCallCheck(this, Snake);

			this.head = new Square(100, 0);
			this.draw();
			this.direcction = "right";
			this.head.add();
		}

		_createClass(Snake, [{
			key: "draw",
			value: function draw() {
				this.head.draw();
			}
		}, {
			key: "right",
			value: function right() {
				if (this.direcction === "left") return;
				this.direcction = "right";
			}
		}, {
			key: "left",
			value: function left() {
				if (this.direction === "right") return;
				this.direcction = "left";
			}
		}, {
			key: "up",
			value: function up() {
				if (this.direcction === "down") return;
				this.direcction = "up";
			}
		}, {
			key: "down",
			value: function down() {
				if (this.direcction === "up") return;
				this.direcction = "down";
			}
		}, {
			key: "move",
			value: function move() {
				if (this.direcction === "up") return this.head.up();
				if (this.direcction === "right") return this.head.right();
				if (this.direcction === "left") return this.head.left();
				if (this.direcction === "down") return this.head.down();
			}
		}, {
			key: "eat",
			value: function eat() {
				this.head.add();
			}
		}, {
			key: "dead",
			value: function dead() {
				// Hit with the body or hit with the border
				return this.head.hit(this.head) || this.head.hitBorder();
			}
		}]);

		return Snake;
	})();

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var snake = new Snake();
	var foods = [];

	var animation = setInterval(function () {
		snake.move();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		snake.draw();
		drawFood();
		if (snake.dead()) {
			window.clearInterval(animation);
			console.log("You lost");
		}
	}, 1000 / 5);

	setInterval(function () {
		var newFood = Food.generateFood();
		foods.push(newFood);
	}, 4000);

	window.addEventListener("keydown", function (ev) {
		if (ev.keyCode > 36 && ev.keyCode < 41) ev.preventDefault(); //with this don´t move the window when you use the
		if (ev.keyCode === 40) return snake.down();
		if (ev.keyCode === 39) return snake.right();
		if (ev.keyCode === 38) return snake.up();
		if (ev.keyCode === 37) return snake.left();
	});

	function drawFood() {
		for (var index in foods) {
			var food = foods[index];
			if (typeof food !== "undefined") {
				food.draw();
				if (hit(food, snake.head)) {
					snake.eat();
					removeFood(food);
				}
			}
		}
	}

	function removeFood(food) {
		foods = foods.filter(function (f) {
			return food !== f;
		});
	}

	function hit(a, b) {
		var hit = false;
		if (b.x + b.width >= a.x && b.x < a.x + a.width) {
			if (b.y + b.height >= a.y && b.y < a.y + a.height) {
				hit = true;
			}
		}
		if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
			if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
				hit = true;
			}
		}
		if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
			if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
				hit = true;
			}
		}
		return hit;
	}

	function squareHit(square_1, square_2) {
		return square_1.x == square_2.x && square_1.y == square_2.y;
	}
})();
