let canvas;
let context;

let request_id;

let fpsInterval = 1000/30;
let now;
let then = Date.now();

let player = {
    x : 0,
    y : 150,
    width : 32,
    height : 32,
    frameX: 0,
    frameY : 0,
    xChange : 0,
    yChange : 0,
    health:100,
    level : 1,
    exp : 0,
    levelThreshold : 640, 
    defeated : 0,
    hurt : new Audio(),
    weapons : []
};
let playerImage = new Image();

let availableWeapons = ["Dagger", "Axe", "Fire", "Onion"]

let enemies = []
let enemyImage = new Image()
let enemyImageI = new Image()


let gameMusic = new Audio()

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let background =[
	[128, 16, 129, 16, 16, 144, 113, 16, 132, 115, 116, 16, 16, 132, 144, 16, 16, 16, 16, 115, 113, 129, 16, 129, 129, 16, 115, 128, 16, 16, 16, 16, 16, 16, 112, 115, 144, 16, 115, 148],
	[16, 16, 145, 114, 144, 144, 16, 16, 148, 116, 16, 16, 148, 144, 16, 128, 16, 144, 16, 113, 144, 145, 148, 145, 145, 128, 144, 144, 144, 115, 16, 16, 16, 132, 115, 113, 144, 16, 148, 16],
	[71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72], 
	[167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168, 167, 168],
	[16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
	[128, 99, 16, 112, 112, 98, 144, 128, 144, 113, 16, 16, 144, 114, 16, 144, 114, 128, 16, 144, 16, 113, 128, 97, 16, 16, 97, 112, 97, 16, 114, 16, 97, 98, 16, 98, 16, 144, 144, 16],
    [32, 64, 48, 80, 64, 16, 64, 16, 48, 16, 32, 48, 32, 48, 32, 80, 16, 1, 83, 83, 83, 3, 32, 16, 64, 16, 64, 80, 80, 32, 80, 32, 32, 64, 16, 16, 80, 48, 64, 48],
    [32, 80, 64, 48, 80, 32, 80, 16, 80, 48, 16, 80, 32, 64, 16, 32, 1, 66, 20, 52, 4, 19, 32, 80, 64, 48, 32, 32, 32, 64, 32, 16, 48, 48, 64, 16, 64, 64, 64, 32],
    [64, 64, 48, 32, 64, 64, 16, 64, 80, 80, 80, 32, 16, 48, 48, 1, 66, 4, 4, 20, 51, 80, 80, 16, 32, 16, 80, 32, 48, 48, 32, 16, 48, 80, 32, 64, 80, 16, 32, 48],
	[2, 2, 83, 83, 2, 2, 2, 83, 2, 83, 2, 83, 2, 2, 2, 66, 52, 4, 4, 4, 65, 2, 83, 2, 83, 83, 2, 2, 83, 83, 83, 2, 2, 83, 2, 2, 83, 2, 2, 2],
    [52, 52, 36, 20, 20, 36, 36, 20, 68, 20, 68, 68, 68, 4, 52, 20, 52, 36, 52, 20, 36, 52, 68, 36, 4, 52, 68, 4, 68, 36, 52, 20, 52, 52, 68, 68, 52, 20, 52, 20],
    [68, 36, 68, 68, 36, 52, 4, 20, 36, 20, 36, 20, 4, 36, 20, 68, 68, 52, 36, 4, 4, 4, 4, 36, 4, 36, 52, 36, 4, 36, 36, 68, 68, 52, 4, 52, 4, 52, 4, 52],
	[52, 68, 52, 4, 68, 52, 20, 20, 36, 68, 36, 68, 52, 52, 36, 4, 36, 20, 4, 4, 36, 52, 4, 4, 20, 52, 36, 52, 52, 52, 20, 52, 68, 20, 68, 52, 68, 20, 68, 20],
    [4, 52, 68, 20, 52, 4, 20, 68, 4, 20, 4, 20, 52, 4, 20, 68, 20, 52, 36, 20, 4, 4, 52, 20, 4, 36, 4, 36, 36, 4, 36, 4, 4, 20, 20, 36, 4, 36, 52, 68],
    [34, 34, 84, 84, 34, 34, 34, 84, 34, 84, 34, 84, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 84, 34, 84, 84, 34, 34, 84, 84, 84, 34, 34, 84, 34, 34, 84, 34, 34, 34],
	[16, 16, 16, 16, 16, 16, 16, 16, 112, 16, 99, 16, 99, 115, 99, 16, 114, 16, 16, 16, 16, 97, 114, 16, 16, 16, 16, 113, 112, 115, 16, 98, 16, 16, 98, 16, 16, 96, 16, 16],
    [64, 114, 128, 144, 128, 48, 48, 144, 80, 16, 98, 112, 32, 144, 128, 96, 114, 98, 48, 96, 16, 144, 97, 16, 128, 64, 97, 144, 48, 16, 144, 80, 32, 99, 80, 144, 16, 144, 128, 144],
    [80, 48, 112, 64, 114, 115, 98, 98, 114, 99, 16, 64, 64, 64, 64, 16, 97, 80, 48, 32, 48, 16, 97, 97, 80, 48, 115, 97, 112, 32, 99, 64, 112, 16, 48, 113, 64, 64, 96, 16],
    [71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72, 71, 72],
	[87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88, 87, 88]
 ]
    
let backgroundImage = new Image();
let tilesPerRow = 16;
let tileSize = 16;

let startTime;

let coinImage = new Image();
let coins = []
let pickups = []

let attack1 ={
    width: 64,
    frameX:0,
    height: 64,
    image: new Image(),
    imageI: new Image()
}

let onion = new Image();

let dagger ={
    image : new Image(),
    knifeX : 0
} 

let axes = []
let axeImage = new Image();
let cooldown = 0;

let direction = ""

let gameOver = false;
let gameOverImage = new Image();

document.addEventListener("DOMContentLoaded", init, false);

function init () {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    player.x = (canvas.width/2) -player.width
    player.y = (canvas.height/2)
    dagger.knifeX = player.x+player.width

    load_assets ([
        {"var":playerImage, "url":"static/sprites/raccoon.png"},
         {"var":backgroundImage, "url":"static/sprites/tiles.png"},
         {"var":coinImage, "url":"static/sprites/coins.png"},
        {"var":attack1.image, "url":"static/sprites/weapons/animate.png"},
        {"var":attack1.imageI, "url":"static/sprites/weapons/animateInvert.png"},
        {"var":onion, "url":"static/sprites/weapons/onion.png"},
        {"var":dagger.image, "url":"static/sprites/weapons/dagger.png"},
        {"var":enemyImage, "url":"static/sprites/enemies/enemy.png"},
        {"var":enemyImageI, "url":"static/sprites/enemies/enemyInverted.png"},
        {"var":gameMusic, "url":"static/music/music.ogg"},
        {"var":axeImage, "url":"static/sprites/weapons/axe.png"},
        {"var":player.hurt, "url":"static/music/playerHit.wav"},
        {"var":gameOverImage, "url":"static/sprites/gameOver.png"}], draw),
    gameMusic.volume=0.5
    document.body.style.zoom = "150%";

    // Selecting a random starting weapon
    let random =  Math.floor(Math.random() * availableWeapons.length);
    player.weapons.push(availableWeapons[random])
    availableWeapons.splice(random,1)
}


function draw () {
    gameMusic.play()

    request_id = window.requestAnimationFrame(draw)
    let now = Date.now()
    let elapsed = now - then
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval)


            // Keeping track of the timedd
    let currentTime = new Date().getTime();
    let elapsedTime = currentTime-startTime;
    let element = document.querySelector(".time");

    let elapsedSecs = Math.round(elapsedTime/1000)

    if(elapsedSecs > 59){
        if(elapsedSecs%60 < 10){
            element.innerHTML = Math.floor(elapsedSecs/60) + ":0" + elapsedSecs%60;
        }else{
            element.innerHTML = Math.floor(elapsedSecs/60) + ":" + elapsedSecs%60;
        }
    }else{
        if(elapsedSecs%60 < 10){
            element.innerHTML = "0:0" + elapsedSecs;
        }else{
            element.innerHTML = "0:" + elapsedSecs;
        }
    }

    //Displaying Player Level and enemies defeated (before checking for game over, weapon display is same as game over display)
    let levelText = document.querySelector("#level");
    let defeatedText = document.querySelector("#defeated");
    let defeatedField = document.querySelector("#defeatedField")
    let weapons = document.querySelector("#outcome")

    levelText.innerHTML = "Player LVL: " + player.level
    defeatedText.innerHTML = "Defeated: " + player.defeated
    defeatedField.value = player.defeated
    weapons.innerHTML = "Weapons: " +player.weapons

    if (player.health < 1) {
        context.drawImage(gameOverImage,0,0,canvas.width,canvas.height, 0,0,canvas.width,canvas.height)
        gameOver = true
        stop("You died!");
        gameMusic.pause()
    }
    if(elapsedSecs === 300){
        context.drawImage(gameOverImage,0,0,canvas.width,canvas.height, 0,0,canvas.width,canvas.height)
        gameOver = true
        stop("Time's up!");
        gameMusic.pause()
    }

    
    //Draw background on canvas
    context.clearRect(0,0,canvas.width,canvas.height);
    for(let r = 0; r<20; r++){
        for(let c = 0; c<40; c++){
            let tile = background[r][c];
            if (tile>=0){
                let tileRow = tile/tilesPerRow | 0 ;
                let tileCol = tile % tilesPerRow | 0 ;
                context.drawImage(backgroundImage,
                    tileCol*tileSize, tileRow*tileSize, tileSize, tileSize,
                    c*tileSize, r*tileSize, tileSize, tileSize);
            }
        }
    }

    //Draw Player
    context.drawImage(playerImage,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width*1.3, player.height*1.3);

    if ((moveLeft || moveRight || moveUp || moveDown)&&
    ! ((moveLeft && moveRight) || (moveUp && moveDown))){
        player.frameX = (player.frameX+1) % 4
    }
    if((moveLeft && moveRight) || (moveUp && moveDown)){ // || !moveLeft || !moveRight || !moveDown || !moveUp
        player.frameX = 0;
        player.frameY = 0;
    }

    //Draw other objects

            // HEALTH BAR
    context.fillStyle = "black"
    context.fillRect(player.x-5, player.y+player.width+10, 50, 6.5);
    context.fillStyle = "red"
    context.fillRect(player.x-5, player.y+player.width+10, player.health/2, 6.5);

    if (player.health < 100){
        player.health = player.health+0.05;
    }

            //XP BAR
    context.fillStyle = "#BEBF60"
    context.fillRect(0,0,canvas.width,11)
    context.fillStyle = "black"
    context.fillRect(0,1,canvas.width-1,9)
    context.fillStyle = "#2266DC"
    context.fillRect(0,1,player.exp-1,9)




    // SPAWN ENEMIES
    if(elapsedSecs%3 == 0 && enemies.length < 20 + elapsedSecs/8 ){spawn_enemies()}

    //ENEMY HANDLING
    for(let enemy of enemies){
        //Draw enemies
        if (!enemy.blinking){
            if(enemy.x > player.x){
                context.drawImage(enemyImageI,
                    0,0,32,32,
                    enemy.x,enemy.y,32,32);
            }else if(enemy.x < player.x){
                context.drawImage(enemyImage,
                    0,0,32,32,
                    enemy.x,enemy.y,32,32);
            }
        }
        //Player tracking & attack
        enemyToEnemyCollision();
    if(!(rangeCheck(enemy.x, player.x, player.x+player.width) && rangeCheck(enemy.y, player.y, player.y+player.height))){
            if(enemy.x > player.x+30){
                enemy.x = enemy.x - enemy.size/15;
            }
            if (enemy.x < player.x){
                    enemy.x = enemy.x + enemy.size/15;
            }
            if(enemy.y > player.y+30){
                enemy.y = enemy.y - enemy.size/30;
            }
            if (enemy.y < player.y){
                enemy.y = enemy.y + enemy.size/30;
            }
    }else{
            player.health = player.health-0.5;
    }

    //Enemy death 
    if(enemy.health < 1){
            let coin = {
                x:enemy.x+16,
                y:enemy.y+16
            }

            if(randint(0,100) <= 20){
                context.drawImage(coinImage, 321, 191, 16, 16, coin.x, coin.y, 16,16) 
            }
            coins.push(coin)
            player.defeated++
    }
    }

    //COINS (XP Points)
    for(let coin of coins){
        context.drawImage(coinImage,
        16,16,16,16,
        coin.x,coin.y,16,16);
        let coinX = coin.x;

        //First if-statement checks whether the player is in range to "attract" the coin towards him
        if(rangeCheck(player.x, coin.x-player.width*2, coin.x+player.width*2)){
            //Second if-statement checks whether the player is actually within a pick-up range (smaller range)
            if(rangeCheck(player.x, coin.x-16,coin.x+16) && rangeCheck(Math.round(player.y), Math.round(coin.y-16),Math.round(coin.y+16))){
                player.exp = player.exp + 96;
                if(player.exp >= player.levelThreshold){

                    levelText.style.color = "yellow";
                    levelText.style.fontSize = "85%";
                    levelText.style.fontWeight = "bold";
                    setTimeout(function(){
                    levelText.style.color ="white" ;
                    levelText.style.fontSize = "70%";
                    levelText.style.fontWeight = "normal"}, 350);

                    player.exp = 0;
                    player.levelThreshold = player.levelThreshold * 1.2;
                    player.level = player.level + 1;
                
                    if(availableWeapons.length > 0 && player.level%3 == 0){
                        let random =  Math.floor(Math.random() * availableWeapons.length);
                        player.weapons.push(availableWeapons[random])
                        availableWeapons.splice(random,1)
                        console.log(player.weapons, availableWeapons)
                    }
                }
                coins = coins.filter(coin => coin.x != coinX);
            }else{
                if(player.x > coin.x){
                    coin.x = coin.x+2
                }else if(player.x < coin.x){
                    coin.x = coin.x-2
                }

                if(Math.round(player.y+player.height/2)>Math.round(coin.y)){
                    coin.y++
                }else if(Math.round(player.y+player.height/2)<Math.round(coin.y)){
                    coin.y--
                }
            }
        }
   
    }
    //Enemy death (drop level up gem & delete from canvas)
    enemies = enemies.filter(enemy => enemy.health >= 1);


    //Handle key presses

        // Horizontal Movement
    if (moveRight && ! moveLeft) {
        player.frameY = 5;
        for(let enemy of enemies){
            enemy.x = enemy.x - player.width/4
        }
        for(let coin of coins){
            coin.x = coin.x - player.width/4
        }
        moveMap("right")
        
    };
    if (moveLeft && ! moveRight) {
        player.frameY = 3;
        for(let enemy of enemies){
            enemy.x = enemy.x + player.width/4
        }
        for(let coin of coins){
            coin.x = coin.x + player.width/4
        }
            moveMap("left")
    };

        // Vertical Movement - Check not going off screen
    if(player.y > 0+16+16){
        if (moveUp  && ! moveDown) {
            player.y = player.y - player.height/6;
            player.frameY = 7;
            
        };
    }
    if(player.y < canvas.height-player.width-32){
        if (moveDown && ! moveUp) {
            player.y = player.y + player.height/6;
            player.frameY = 1;
        };
    }
    
    
    if(player.weapons.includes("Fire") && elapsedSecs%2){
        fireGauntlet();
    }

    if(player.weapons.includes("Onion")){
        context.drawImage(onion,
            0,0,64,64,
            player.x-player.width+5,player.y-player.height+5,64*1.5,64*1.5);
        
        if(elapsedSecs%2===0){
            for(let enemy of enemies){
            // if((enemy.x > player.x-player.width && enemy.x <(player.x-player.width-5)+64*1.5)
            // && (enemy.y>player.y-player.height+5 && enemy.y < (player.y-player.height+5)+64*1.5)){
            if(rangeCheck(enemy.x,player.x-32-enemy.size,player.x+player.width+32)
            && rangeCheck(enemy.y, player.y-player.height-32, player.y+player.height+32)){
                //enemy is in garlic range -> take damage
                    // console.log("Garlic range")
                    enemy.health = enemy.health - 8 + (player.level/2)
                    player.hurt.play()
                    enemy.blinking = true
                    setTimeout(function(){enemy.blinking = false}, 50)
                }
            }
        }
    }

    if(player.weapons.includes("Axe")){
        axeSpree();
    }
    if(player.weapons.includes("Dagger")){
        daggerThrow();
    }

    //Ending the game (At the end to draw over the canvas)
    if(gameOver === true){
        context.drawImage(gameOverImage,0,0,canvas.width,canvas.height, 0,0,canvas.width,canvas.height)
    }
}

function fireGauntlet(){
    let aMinX = 0;
    if(player.frameY === 3 || moveLeft){
        context.drawImage(attack1.imageI,
            attack1.frameX,attack1.height*7,attack1.width,attack1.height,
            player.x-120, player.y-10, attack1.width*2, attack1.height/1.5);

        aMinX = player.x-120;
        
        if(attack1.frameX != 0){
            attack1.frameX = attack1.frameX-attack1.width
        }else{
                attack1.frameX = 448
        }

        for(let enemy of enemies){
            if(aMinX < enemy.x && enemy.x < player.x){
                enemy.health = enemy.health - 2 + (player.level/2)
                player.hurt.play()
            }
        }
        
    }else{
        context.drawImage(attack1.image,
            attack1.frameX,attack1.height*7,attack1.width,attack1.height,
            player.x+30, player.y-10, attack1.width*2, attack1.height/1.5);
        
        aMinX = player.x+30;

        if(attack1.frameX != 512){
            attack1.frameX = attack1.frameX+attack1.width
        }else{
                attack1.frameX = 0
    
        }
        for(let enemy of enemies){
            if(aMinX < enemy.x && enemy.x < aMinX+attack1.width*2){
                // console.log("Whip Hit")
                enemy.health = enemy.health - 3.5 + (player.level/2)
                // player.hurt.play()

                enemy.blinking = true
                setTimeout(function(){enemy.blinking = false}, 50)
            }
        }
    }
  
}

function axeSpree(){
    
    if(axes.length < 3){
        let axe= {
            x : player.x+player.width/4,
            y : player.y,
            size : 32,
            xShift:randint(-7,7),
            yShift:randint(-18,-10)
        }
        axes.push(axe)
    }

    if(cooldown=== 0){
        axes = axes.filter(axe => axe.y < canvas.height)
        cooldown = 80
    }else{
        cooldown--;
    }


    for (let a of axes) {
        if(a.xShift > 0){
            context.drawImage(axeImage,
            32,0,32,32,a.x,a.y,a.size,a.size) 
        }else{
            context.drawImage(axeImage,
            0,0,32,32,a.x,a.y,a.size,a.size)
        }
        a.x = a.x+a.xShift;
        a.y = a.y+a.yShift;
        a.yShift = a.yShift +1.5;
    }

    for(let enemy of enemies){
        for(let a of axes){
        if(rangeCheck(enemy.x, a.x, a.x+a.size) &&
        rangeCheck(enemy.y, a.y, a.y+a.size)){
            // console.log("Axe Hit")
            enemy.health = enemy.health -50
            enemy.blinking = true
            setTimeout(function(){enemy.blinking = false}, 50)
        }
        }
    }
}

function daggerThrow(){
    //Checks if the player is facing left to throw knife in that direction
    //here the variable direction is used to keep the knife going in that direction
     //until it reaches the end in case the player starts moving (aiming) to the other side      
    if ((player.frameY ==3 || moveLeft || direction == "left")&&direction!="right"){
        direction = "left"
        // context.save()
        // context.scale(-1,1)
        context.drawImage(dagger.image,
            16,0,16,16,
            dagger.knifeX-player.width,player.y+player.height/2,32,16)
        // context.restore()
        dagger.knifeX = dagger.knifeX - player.width/2.5;
        if(dagger.knifeX < 0){
            dagger.knifeX = player.x + player.width
            direction = ""
        }
    }else if (direction !="left"){
        direction = "right"
        context.drawImage(dagger.image,
            0,0,16,16,
            dagger.knifeX,player.y+player.height/2,32,16)
        dagger.knifeX = dagger.knifeX + player.width/2.5;
        if(dagger.knifeX > canvas.width){
            dagger.knifeX = player.x + player.width
            direction = ""
        }
    }
//     //spawn at same y level as player
//     //check direction that the player is facing
//         //knife will go in that direction until it hits an enemy or exits the canvas

//             //check if the knife hits an enemy
    for(let enemy of enemies){
    if(rangeCheck(dagger.knifeX, enemy.x-10,enemy.x+5)&& rangeCheck(enemy.y, player.y-5, player.y+5)){
        // console.log("Dagger Hit")
        enemy.blinking = true
        enemy.health = enemy.health - 40 + (player.level/2)
        setTimeout(function(){enemy.blinking = false}, 50)
        player.hurt.play()

    }
    }
}

function spawn_enemies(){
    // if(enemies.length < 20){
    for(let i = 0; i < 2; i++){
    let enemy = {
        x:randint(0,1),
        y:randint(64, canvas.height-32),
        size:32,
        blinking:false,
        health:100,
    }
        if(enemy.x == 1){
            enemy.x = canvas.width
        }
        // console.log(enemy.x, enemy.y)
        enemies.push(enemy)
    }
    // }
}

function rangeCheck(x, min, max){
    if(x >= min && x <= max){
        return true
    }else{
        return false
    }
    return x >= min && x<= max;
}

function moveMap(direction){
    // This will swap the first and last... wrong
        // let min = 0
        // let max = background[0].length-1
        
        // if (direction === "left"){
        //     for(let i = 0; i <background.length-1;i++){
        //         temp = background[i][min]
        //         background[i][min] = background[i][max]
        //         background[i][max] = temp
        //     }
    let max = background[0].length-1
    let min = 1
    let temp = 0
    if (direction === "right"){
        let firstCol = []
        for(let i = 0; i <background.length;i++){
            //save first column in a temp variable
            temp = background[i][0]
            firstCol.push(temp)
            //last column will be repeated - replace the last column with the temp (first column)
        }


        for(let colI = 0; colI < max; colI++){
            for(let rowI = 0; rowI <= background.length-1; rowI++){
                background[rowI][colI] = background[rowI][colI +1]
            }
        }
                // //replace last col
                for(let i = 0; i<background.length;i++){
                    background[i][max] = firstCol[i]
                }
    }else if(direction === "left"){
        //opposite (change indices)

        let lastCol = []
        for(let i = 0; i <background.length;i++){
            temp = background[i][background[0].length-1]
            lastCol.push(temp)
        }


        for(let colI = max; colI >= 1; colI= colI-1){
            let first = background[0][colI]

            for(let rowI = 0; rowI <= background.length-1; rowI++){
                background[rowI][colI] = background[rowI][colI-1]
            }
        }

        //replace first col
        for(let i = 0; i<background.length;i++){
            background[i][0] = lastCol[i]
        }
    }
}

function enemyToEnemyCollision (){
    for(let enemy1 of enemies){
        for(let enemy2 of enemies){
            if(!(enemy1.x ===  enemy2.x && enemy1.y===enemy2.y)){ //If the two enemies are distinct
                //If the first enemy is colliding with the second enemy (SAME X AND Y - same pos)
                if(rangeCheck(enemy1.x, enemy2.x, enemy2.x+enemy2.size) && 
                rangeCheck(enemy1.y, enemy2.y, enemy2.y+enemy2.size)){
                        if(enemy1.y <  canvas.height-64 && enemy2.y > 32){
                            enemy1.y++
                            enemy2.y--
                            if(!rangeCheck(enemy2.y, player.y, player.y+player.height)){
                                    enemy1.x++
                                    enemy2.x--
                            }
                        }
                }
            }
        }
}
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}

function stop(outcome) {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);

    let element = document.querySelector("#outcome");
    element.innerHTML=outcome;

    let results = document.querySelector(".results");
    results.style.display = "block"

    window.cancelAnimationFrame(request_id);
}

function load_assets (assets, callback) {
    let num_assets = assets.length;
    let loaded = function () {
        console.log("loaded")
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
            startTime = new Date().getTime();
        }
    };

    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url
    }
}