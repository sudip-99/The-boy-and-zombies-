const canvas = document.getElementById('canvas')
const scoreEl = document.getElementById('score')
const audio = new webkitSpeechRecognition()
audio.interimResults = true
audio.start()


const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = innerWidth
const CANVAS_HEIGHT = canvas.height = 250
let word = prompt('THIS GAME CAN BE PLAYED VIA VOICE OR TOUCH\nENTER A WORD\nIF YOU DON\'T ENTER ANYTHING THEN BY DEFAULT EVERY SOUND WILL BE ACCEPTED\nFOR BETTER PERFORMANCE DON\'T ENTER ANYTHING')


let event = null
let gameOver = false
let SCORE = 0
let gameFrame = 0
let staggerFrame = 3
let voiceCounter = 0
let birdArr = new Array()
// class Zombie bird

let birdImg = new Image()
birdImg.src = 'raven.png'
class Bird {
  constructor(x,y){
    this.x = x 
    this.y = y 
    this.width = 271
    this.height = 194
    this.markForDeletion = false 
    this.frameX = 0 
    this.maxFrame = 5 
    this.speed = 1
    this.velX = 0
  }
  
  draw () {
    ctx.fillStyle = 'rgba(0,0,0,0)' 
    ctx.fillRect(this.x,this.y,20,20)
    ctx.drawImage (birdImg,this.width*this.frameX,0,this.width,this.height,this.x,this.y,20,20)
    this.update()
  }
  
  update () {
    if (!(gameFrame%staggerFrame)){
      if (this.frameX<this.maxFrame)
       this.frameX++
      else this.frameX = 0
    }
    if (this.x < -this.width) 
       this.markForDeletion = true 
     
    if (player.x+player.p_width>=this.x &&
        player.x <= this.x + 20 && 
        player.y+player.p_height>=this.y &&
        player.y <= this.y+20
    ) gameOver = true
    
    this.x -= this.speed + this.velX
   
    this.velX += 0.05
  }
  
}

// class  Background Layer

class Layer {
  constructor (image, moveSpeed, y_pos) {
    this.x = 0
    this.y = y_pos
    this.width = CANVAS_WIDTH
    this.height = CANVAS_HEIGHT
    this.x2 = this.width
    this.image = image
    this.moveSpeed = moveSpeed
  }

  update () {
    if (this.x < -this.width)
      this.x = this.width + this.x2 - this.moveSpeed
    else this.x -= this.moveSpeed

    if (this.x2 < -this.width)
      this.x2 = this.width + this.x - this.moveSpeed
    else this.x2 -= this.moveSpeed

  }

  draw () {
    ctx.drawImage (this.image, this.x, this.y, this.width, this.height)
    ctx.drawImage (this.image, this.x2, this.y, this.width, this.height)

    this.update()
  }
}

// player class

class Player {
  constructor (x, y, size) {
    this.x = x
    this.y = y
    this.p_width = 18 
    this.p_height = 24
    this.z_width = 16
    this.z_height = 25
    this.gravity = 0
    this.velocity = 0
    this.velX = 0.01
    this.runing_speed = 1
    this.slowDown = false
    this.maxJumpHeight = 50
    this.imgSrc = new Array('player.png', 'enemy_zombie.png')
    this.images = new Array()
    for (let i = 0; i < 2; ++i) {
      this.images.push(new Image())
      this.images[i].src = this.imgSrc[i]
    }
    this.playerFrameX = 8 //8
    this.zombieFrameX = 8 //8
    this.playerWidth = 669
    this.playerHeight = 569
    this.playerSize = 60
    this.zombieWidth = 292
    this.zombieHeight = 410
    this.zombieSize = 50
    this.px = 25.5
    this.py = 25
    this.zx = 25 
    this.zy = 15
  }

  draw () {
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(this.x, this.y, this.p_width, this.p_height)
    ctx.drawImage(this.images[0], this.playerWidth*this.playerFrameX, 0, this.playerWidth, this.playerHeight, this.x-this.px, this.y-this.py, this.playerSize, this.playerSize)

  }

  update() {
    if (this.y >= 168) {
      this.velocity = 0
      this.gravity = 0
    }

    if (event) {
      if (this.y > this.maxJumpHeight) {
           this.y -= 10

      } else {
        event = null
        this.gravity += 5
        this.velocity += 5
      }

    }

    this.y += this.velocity + this.gravity

  }
  drawEnemy() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.z_width, this.z_height)
    ctx.drawImage(this.images[1], this.zombieWidth*this.zombieFrameX, 0, this.zombieWidth, this.zombieHeight, this.x-this.zx, this.y-this.zy, this.zombieSize, this.zombieSize)

  }

  moveEnemy() {
    if (this.x < -this.z_width) {
      this.x = CANVAS_WIDTH+this.z_width
      SCORE++
      scoreEl.innerText = SCORE

    }
    if (this.velX > 8) {
      this.slowDown = true
    } else this.velX += 0.01

    if (this.slowDown) {
      if (this.velX > 0) {
        this.velX -= 0.1
        //alert (this.velX)
      } else this.slowDown = false
    }

    this.x -= this.velX + this.runing_speed

  }

}
const player = new Player (x = 70, y = 168, size = 30)

const enemy = new Player (x = 400, y = 163, size = 35)


function checkForColision() {
  if (
    player.x+player.p_width>=enemy.x &&
    player.x <= enemy.x+enemy.z_width &&
    player.y+player.p_height>= enemy.y
  ) gameOver = true
}
const bgImg = new Image()
bgImg.src = 'bg.jpg'
const backgroundLayer = new Layer(bgImg, 2, 0)


function animate() {
  backgroundLayer.draw()
  
  enemy.drawEnemy()
  enemy.moveEnemy()
  player.draw()
  player.update()
  checkForColision()
  if (!(gameFrame%staggerFrame)) {
    // player animation
    if (player.playerFrameX < 7)
      player.playerFrameX++
    else player.playerFrameX = 0
    // zombie animation
    if (enemy.zombieFrameX < 7)
      enemy.zombieFrameX++
    else enemy.zombieFrameX = 0
  }
  
 let y = Math.floor(Math.random()*100)+10
 let x = CANVAS_WIDTH+20
  if (Math.random()>0.99){
    birdArr.push(new Bird(x,y))
  }
  
  birdArr.forEach(bird =>{
    bird.draw()
  })
  
  birdArr = birdArr.filter(bird => !bird.markForDeletion)
 
  if (!gameOver)
    requestAnimationFrame(animate)
  else {
    alert ('SWIPE DOWN TO RESTART')
    return 
  }
  gameFrame++
}


animate()


canvas.addEventListener('mousedown', function () {
        if (player.y >= 168)
          event = 'jump'
      })
      
    
audio.addEventListener ('result', function (e) {
  if (word){
  if (e['results']['0']['0']['transcript'] == word){
   if (!(voiceCounter%5))
      if (event==null) event = 'jump'
   }
  } else {
    if (!(voiceCounter%5))
      if (event==null) event = 'jump'
  }
  
   voiceCounter++

  })


  audio.addEventListener('end', function() {
    audio.start()
  })

      
function changeControl() {
  alert ('Created by Sudip\nCSS designer Sarower')
}