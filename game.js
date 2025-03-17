$(document).ready(function() {
const canvas = document.querySelector('canvas');
const ca = canvas.getContext('2d');
canvas.width = 1520;
canvas.height = 705;
const gravity= 0.6;
let gameOver = false;

console.log(localStorage.getItem('thd'));
console.log(localStorage.getItem('chara'));
var diff = localStorage.getItem('thd');
var espeedx=15;
switch(diff){
case 'easy':
espeedx=10;
break;
case 'med':
espeedx=15;
break;
case 'hard':
espeedx = 25;
break;
default:
alert('Error: Difficulty not loaded correctly');
}

class bg {
    constructor(){
        this.image = new Image();
        this.image.src = 'Sampleimage.png';
        this.x=0;
        this.y=0; 
        this.height=705;
        this.width=1600;
        this.speed=5;     
    }
    draw(){
        if(!this.image.complete) return;
        else {
            ca.drawImage(this.image,this.x,this.y,this.width,this.height);
            ca.drawImage(this.image,this.x+this.width,this.y,this.width,this.height);
            
        }
    }
    update(){
        this.x-=this.speed;
        if(this.x<0 - this.width) this.x=0;
        this.draw();
    }
}

class player {
constructor(position){
        this.image=new Image();
        const chara = localStorage.getItem('chara');
        if (!chara) {
            console.log("Character not specified, using default.");
            this.image.src = "Dude_Monster_Idle_4.png"; 
        }
        switch(chara){
            case '1':
            this.image.src="Dude_Monster_Idle_4.png";
            break;
            case '2':
            this.image.src="Owlet_Monster_Idle_4.png";
            break;
            case '3':
            this.image.src="Pink_Monster_Idle_4.png";
            break;
            default:
            alert('Error loading character');
        } 
        this.position=position;
        this.width = 60;
        this.height = 60;
        this.currentframe=0;
        this.gameframe=0;
        this.buffer=8;
        this.velocity = {
            x: 0,
            y: 1,
        }
    }
    draw(){
        ca.drawImage(this.image, 32 * this.currentframe, 0, 32, 32, this.position.x, this.position.y, 100, 100);
        this.gameframe++;
        if (this.gameframe % this.buffer === 0) {
            if (this.currentframe >= 3) {
                this.currentframe = 0;
                this.currentframe++;
            } else {
                this.currentframe++;
            }
        }
    }
    update(){
        this.draw();
        if(keys.w.pressed){
            i.velocity.y=-12;
        }
        if(keys.s.pressed){
            i.velocity.y=5;
        }
        if(keys.d.pressed){
            i.velocity.x=2;
        }
        if(keys.a.pressed){
            i.velocity.x=-2;
        }
    
    if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
    }
    if ((this.position.y+this.velocity.y)<(canvas.height-100)){
        this.position.y+=this.velocity.y;
        this.velocity.y+=gravity;
    }
    else {
            this.position.y = (canvas.height-100);
            this.position.x+=this.velocity.x;
            if(i.velocity.x>-0.4) i.velocity.x-=0.6;
        }

        if ((this.position.x+this.velocity.x)<(canvas.width-100)){
            this.position.x+=this.velocity.x;
        }
        else this.position.x = (canvas.width-100);

        if ((this.position.x>0)){
            this.position.x+=this.velocity.x;
        }
        else this.position.x = 0;
    }
}
class Enemy {
    constructor(position){
        this.image=new Image();
        this.image.src='Black_crystal1.png';
        this.width = 75;
        this.height = 60;
        this.position=position;
        
        this.velocity = {
                x:-Math.floor((Math.random()*espeedx)+1),
                y:0
            }
        this.currentframe=0;
        this.gameframe=0;
        this.buffer=8;
        }
        draw(){
            ca.drawImage(this.image, 266 * this.currentframe, 0, 266, 188, this.position.x, this.position.y, 75, 60);
            this.gameframe++;
            if (this.gameframe % this.buffer === 0) {
                if (this.currentframe >= 5) {
                    this.currentframe = 0;
                    this.currentframe++;
                } else {
                    this.currentframe++;
                }
            }
        }
        update(){
            this.draw();
            this.position.x+=this.velocity.x;
        }
   }  

const keys = {
    w : {
        pressed: false,
    },
    s : {
        pressed: false,
    },
    a : {
        pressed: false,
    },
    d : {
        pressed: false,
    }
}

const i = new player({x:0,y:0});
const back = new bg();
const enemies = [];

function checkCollision(p, e) {
    return (p.position.x+13) < e.position.x + e.width && (p.position.x+13) + p.width > e.position.x &&
           (p.position.y+17) < e.position.y + e.height && (p.position.y+17) + p.height > e.position.y;
}

function generateRandomEnemy() {
    if (enemies.length >= 10) {
        return; 
    }
    const randomY = Math.random() * 0.8* (canvas.height - 100); 
    const newEnemy = new Enemy({ x: canvas.width, y: randomY });
    enemies.push(newEnemy);
}

function generateGroundEnemy() {
    if (enemies.length >= 8) {
        return; 
    }
    const newEnemy = new Enemy({ x: canvas.width, y: 605 });
    enemies.push(newEnemy);
}

function startEnemySpawning() {
    setInterval(() => {
        generateRandomEnemy();
    }, (Math.random()*1700+1)); 
    setInterval(() => {
        generateGroundEnemy();
    }, (Math.random()*1300+1)); 
}

function animate() {
    if (!gameOver) {
        window.requestAnimationFrame(animate);
        ca.clearRect(0, 0, canvas.width, canvas.height);
        back.update();
        i.update();
        enemies.forEach((enemy, index) => {
            enemy.update();
            if (checkCollision(i, enemy)) {
                gameOver = true; 
                showGameOverScreen(); 
                return; 
            }
            if (enemy.position.x < -100) {
                enemies.splice(index, 1);
            }
        });
    }
}

function showGameOverScreen() {
    var gameOver1 = document.getElementById('gposition');
    gameOver1.style.display='block'
    var gameOver2 = document.getElementById('retry');
    gameOver2.style.display='block'
    var gameOver3 = document.getElementById('first');
    gameOver3.style.display='block'
;}

startEnemySpawning();

window.addEventListener('keydown', (event)=>{
switch(event.key){
    case 'w':
        keys.w.pressed=true;
    break
    case 'a':
        keys.a.pressed=true;
    break
    case 's':
        keys.s.pressed=true;
    break
    case 'd':
        keys.d.pressed=true;
    break
}
}
)
window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'w':
            keys.w.pressed=false;
        break;
        case 's':
            keys.s.pressed=false;
        break;
        case 'a':
        keys.a.pressed=false;
        break
        case 'd':
        keys.d.pressed=false;
    }
})
$(document).ready(function(){
$('.colorchange').hover(
    function() {
            $(this).css('color', 'maroon'); 
        },
    function() {
            $(this).css('color', 'white'); 
        }
    );
$('#retry').click(function(){
window.location.href = 'Game.html';
});
$('#first').click(function(){
    window.location.href = 'Title.html';
});
});

animate();
});