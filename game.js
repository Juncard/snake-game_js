;(function(){

	class Random{
		static get(init, end){
			return Math.floor(Math.random() * end) + init
		}
	}

	class Food{
		constructor(x,y){
			this.x = x
			this.y = y
			this.height = 10
			this.width = 10
		}
		static generateFood(){
			return new Food(Random.get(0,480), Random.get(0, 280))
		}

		draw(){
			ctx.fillRect(this.x,this.y,this.width,this.height)
		}
	}

	class Square{
		constructor(x,y){
			this.x = x
			this.y = y
			this.back = null
			this.height = 10
			this.width = 10
		}

		draw(){
			ctx.fillRect(this.x,this.y,this.width,this.height)
			if(this.hasBack()){
				this.back.draw()
			}
			
		}
		add(){
			if(this.hasBack()) return this.back.add()
			this.back = new Square(this.x, this.y)
		}
		hasBack(){
			return this.back !== null
		}
		right(){
			this.copy()
			this.x += 10
		}
		left(){
			this.copy()
			this.x -= 10
		}
		up(){
			this.copy()
			this.y -= 10
		}
		down(){
			this.copy()
			this.y += 10

		}
		copy(){
			if(this.hasBack()){
				this.back.copy()

				this.back.x = this.x
				this.back.y = this.y
			}
		}
		hit(head, second = false){
			//The first and second are because can not be a hit between the first and second
			if(this === head && !this.hasBack()) return false
			if(this === head) return this.back.hit(head, true)

			if(second && !this.hasBack()) return false
			if(second) return this.back.hit(head)

			// Now there are more than 2
			if(this.hasBack()){
				return squareHit(this, head) || this.back.hit(head)
			}

			//If you arrive here, we are checking the last
			return squareHit(this, head)
		}
		hitBorder(){
			return this.x > 480 || this.x < 0 || this.y < 0 || this.y > 280
		}
	}

	class Snake{
		constructor(){
			this.head = new Square(100,0);
			this.draw()
			this.direcction = "right"
			this.head.add()
		}

		draw(){
			this.head.draw()
		}
		right(){
			if(this.direcction === "left") return;
			this.direcction = "right"
		}
		left(){
			if(this.direction === "right") return;
			this.direcction = "left"
		}
		up(){
			if(this.direcction === "down")return;
			this.direcction = "up"
		}
		down(){
			if(this.direcction === "up") return;
			this.direcction = "down"
		}
		move(){
			if(this.direcction === "up") return this.head.up()
			if(this.direcction === "right") return this.head.right()
			if(this.direcction === "left") return this.head.left()
			if(this.direcction === "down") return this.head.down()
		}

		eat(){
			this.head.add()
		}
		dead(){
			// Hit with the body or hit with the border
			return this.head.hit(this.head) || this.head.hitBorder() 
		}
	}


	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')

	const snake = new Snake()
	let foods = []

	const animation = setInterval(function(){
		snake.move()
		ctx.clearRect(0,0, canvas.width, canvas.height)
		snake.draw()
		drawFood()
		if(snake.dead()){
			window.clearInterval(animation)
			console.log("You lost")
		}

	}, 1000/5)

	setInterval(function(){
		const newFood = Food.generateFood()
		foods.push(newFood)
	},4000)

	window.addEventListener("keydown",function(ev){
		if(ev.keyCode > 36 && ev.keyCode < 41) ev.preventDefault() //with this don´t move the window when you use the
		if(ev.keyCode === 40) return snake.down()
		if(ev.keyCode === 39) return snake.right()
		if(ev.keyCode === 38) return snake.up()
		if(ev.keyCode === 37) return snake.left()
	})

	function drawFood(){
		for(const index in foods){
			const food = foods[index]
			if(typeof food !=="undefined"){
				food.draw()
				if(hit(food, snake.head)){
					snake.eat()
					removeFood(food)
				}
			}
		}
	}

	function removeFood(food){
		foods = foods.filter(function(f){
			return food !== f
		})
	}

	function hit(a,b){
		var hit = false
		if(b.x + b.width >= a.x && b.x < a.x + a.width){
			if(b.y + b.height >= a.y && b.y < a.y + a.height){
				hit = true
			}
		}
		if(b.x <= a.x && b.x + b.width >= a.x + a.width){
			if(b.y <= a.y && b.y + b.height >= a.y + a.height){
				hit = true
			}
		}
		if(a.x <= b.x && a.x + a.width >= b.x + b.width){
			if(a.y <= b.y && a.y + a.height >= b.y + b.height){
				hit = true
			}
		}
		return hit
	}

	function squareHit(square_1, square_2){
		return square_1.x == square_2.x && square_1.y == square_2.y

	}


})()