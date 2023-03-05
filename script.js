
//캔버스 세팅
// let canvas = document.createElement('canvas'); //캔버스
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d'); //이미지 그리는걸 도와주는 변수
// canvas.width = 300;
// canvas.height = 450;
document.body.appendChild(canvas);

//이미지 사이즈 (bullet: 25*25, ufo: 35*35, spaceship:40*40)

let backgroundImage, bulletImage, ufoImage, spaceshipImage, gameOverImage;
let gameOver = false; //true->게임 끝
let score = 0; //점수

//우주선 좌표
let spaceshipX = canvas.width/2-20;
let spaceshipY = canvas.height-40;

//총알 좌표
//총알들 저장하는 배열
let bulletList = [];
function bullet(){
    this.x = 0;
    this.y = 0;
    //초기화
    this.init = function(){
        this.x = spaceshipX+18;
        this.y = spaceshipY-25;
        this.alive = true;
        bulletList.push(this);
    }

    this.update = function(){
        this.y -= 5;
    }

    this.checkHit = function(){
        for(let i=0; i<ufoList.length; i++){
            //총알이 ufo와 닿으면
            if(this.y<=ufoList[i].y && this.x>=ufoList[i].x-5 && this.x<=ufoList[i].x+30){
                score ++;
                this.alive = false;
                ufoList.splice(i, 1);
            }
            if(this.y === canvas.height){
                this.alive = false;
            }
        }
    }
}

//UFO 좌표
function randomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}
let ufoList=[];
function ufo(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = -35;
        this.x = randomValue(0, canvas.width - 35);
        ufoList.push(this);
    }
    this.update = function(){
        this.y += 4;

        if(this.y >= canvas.height - 35){
            gameOver = true;
        }
    }
}

//이미지 가져오기
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/backgroundImage.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    ufoImage = new Image();
    ufoImage.src="images/free-icon-ufo-2949108.png";

    spaceshipImage = new Image();
    spaceshipImage.src="images/free-icon-spaceship-1114780.png";

    gameOverImage = new Image();
    gameOverImage.src="images/game-over.png"
}

//총알 생성
function createBullet(){
    let b = new bullet();
    b.init()
}

//ufo 생성
function createUfo(){
    const interval = setInterval(function(){
        let u = new ufo();
        u.init();
    }, 1000);
}

//키보드 조작
let keysDown={}
function setupKeybordListner(){
    //키 누르면 객체에 저장
    document.addEventListener('keydown', function(event){
        keysDown[event.keyCode] = true;
    })
    //키에서 손 떼면 객체에서 삭제
    document.addEventListener('keyup', function(event){
        delete keysDown[event.keyCode]

        //스페이스바 총알
        if(event.keyCode === 32){
            createBullet();
        }
    })
}

function update(){
    if(39 in keysDown){
        spaceshipX += 3
    } // 오른쪽 방향키
    if(37 in keysDown){
        spaceshipX -= 3
    } // 왼쪽 방향키
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    //우주선 화면 밖으로 나가지 않게
    if(spaceshipX >= canvas.width - 35){
        spaceshipX = canvas.width - 35;
    }
    //총알 움직임
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
        bulletList[i].checkHit();
        }
    }
    //ufo 움직임
    for(let i=0; i<ufoList.length; i++){
        ufoList[i].update();
    }
}

//UI이미지 화면에 띄우기
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 40, 40);
    ctx.fillText(`SCORE: ${score}`, 20, 20);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial'

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive === true){
            ctx.drawImage(bulletImage, bulletList[i].x-11, bulletList[i].y);
        }
    }

    for(let i=0; i<ufoList.length; i++){
        ctx.drawImage(ufoImage, ufoList[i].x, ufoList[i].y, 35, 35);
    }
}


function main(){
    if(gameOver === false){ //이미지 계속 호출
        update(); //좌표값 업데이트 후
        render(); //그려주고
        requestAnimationFrame(main); //반복
    }else{ //게임오버
        ctx.drawImage(gameOverImage,(canvas.width-256)/2, 50)
    }
}

loadImage();
setupKeybordListner();
createUfo();
main();
