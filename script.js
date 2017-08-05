/****HEADER****/
/*Globals*/
var curColor = 0;
var canvas, width, height, ctx, entities, keys;
var timeEllapsed, timeNow, deltaTime;
var touchX;
var touchY;
var player1Score = 0;
var player2Score = 0;

var timer;
var game_start;
/*Constants*/
var MIN_DIM = 200;
var backgroundColor = "#FFF";
var FRAME_RATE = 20/1000;
var PADDLE_SPEED_Y = 160;
var BALL_SPEED_X =  120;
var BALL_SPEED_Y = 120;
var INCRIMENT_SPEED = 15;
var START_TIME = 3000;

var BALL_WIDTH = (20/500);
var PADDLE_WIDTH = (40/500);
var PADDLE_HEIGHT = (100/500);

var colors = [
    /*blue*/   "#008CBA", 
    /*orange*/ "#FF7345",
    /*red*/    "#e22f2f",
    /*green*/  "#0aad33",
    /*purple*/ "#6b0bba",
    /*yellow*/ "#f7eb0e"
];
var periodReplacement = '<span class="primary-color">.</span>';

/*Functions*/
function getTouchPos(e) {
    if (!e) var e = event;
    if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            if($('#canvas')[0] && touch.pageX > $('#canvas').position().left && touch.pageY > $('#canvas').position().top){
                e.preventDefault();
            }
            touchX=touch.pageX-touch.target.offsetLeft;
            touchY=touch.pageY-touch.target.offsetTop;
        }
    }
}
function liftFinger(){
    touchY = undefined;
}

function randomDirection(){
    return Math.random() > .5 ? 1 : -1;
}

function globalColor(){
    return $('.primary-color').css('color');
}

function removeColorPeriods(){
    var spans = $('span.primary-color');
    for(var i = 0; i < spans.length; i++){
        spans[i].outerHTML = '.';
    }
}

function addColorPeriods(color){
    var docBody = $(".description").html().replace(/\./g, periodReplacement);
    $(".description").html(docBody);
}

function changeColors(color){
    //Change Periods
    var primaryColor = $('.primary-color');
    for(var i = 0; i < primaryColor.length; i++){
        //$(primaryColor[i]).css('color', colors[color]);
        $(primaryColor[i]).animate({color: colors[color]}, 2000);
    }
    //Change Lines
    var lines = $('.primary-color-line');
    for(var i = 0; i < lines.length; i++){
        /*$(lines[i]).css('color', colors[color]);
        $(lines[i]).css('border-color', colors[color]);
        $(lines[i]).css('background-color', colors[color]);*/
        $(lines[i]).animate(
            {
                color: colors[color],
                borderColor: colors[color],
                backgroundColor: colors[color]
            }, 2000);
    }
    //Change Borders
    var border = $('.primary-color-border');
    for(var i = 0; i < border.length; i++){
        $(border[i]).animate({borderColor: colors[color]}, 2000);
    }
}
//Object Creator
function entity(_specs){
    var specs = (_specs) ? _specs : {};
    //Set entity defaults
    if(!specs.width) specs.width = 10;
    if(!specs.height) specs.height = 10;
    if(!specs.x) specs.x = 0;
    if(!specs.y) specs.y = 0;
    if(!specs.speedX) specs.speedX = 1;
    if(!specs.speedY) specs.speedY = 1;
    if(!specs.color) specs.color = "#FF0000";
    if(!specs.handleInput) specs.handleInput = function(){
        specs.x += specs.speedX;
        specs.y += specs.speedY;
    }
    if(!specs.update) specs.update = function(){
        specs.handleInput();
        ctx.fillStyle = globalColor();
        ctx.fillRect(specs.x, specs.y, specs.width, specs.height);
    }
    specs.collision = function(other){
        if(other.x + other.width <= specs.x) return false;
        if(specs.x + specs.width <= other.x) return false;
        if(other.y + other.height <= specs.y) return false;
        if(specs.y + specs.height <= other.y) return false;
        return true;
    }
    return specs; 
}

function ball(_specs){
    var specs = (!_specs) ? entity() : _specs;
    specs.width = BALL_WIDTH*width;
    specs.height = BALL_WIDTH*height;
    specs.speedX = 0;
    specs.speedY = 0;
    specs. y = width/2 - specs.width/2;;
    specs.x = height/2 - specs.height/2;

    specs.timer = START_TIME;
    specs.start = false;

    specs.resetDirection = function(){
        specs.speedX = BALL_SPEED_X * randomDirection();
        specs.speedY = BALL_SPEED_Y * randomDirection();
    }
    specs.resetBall = function(){
        specs.speedX = 0;
        specs.speedY = 0;
        specs.y = width/2 - specs.width/2;
        specs.x = height/2 - specs.height/2;
    }

    specs.handleInput = function(){
        var collision = false;
        //Detect Collision with paddle
        if(entities["player1"].collision(specs) || entities["player2"].collision(specs) ){
            collision = true;
            //Always Reverse Direction
            specs.speedX *= -1 ;
            specs.x += (specs.speedX/Math.abs(specs.speedX))*5;
            //Check if ball directly underneath or above paddle
            if(ball.y >= entities["player2"].y +  entities["player2"].height
             || ball.y <=  entities["player2"].y
             || ball.y >=  entities["player1"].y +  entities["player2"].height
             || ball.y >=  entities["player1"].y){
                specs.speedX *= -1
            specs.x -= (specs.speedX/Math.abs(specs.speedX))*BALL_WIDTH;
            
            }
        }
        if(specs.y + specs.height> height || specs.y < 0){
            collision = true;
            specs.speedY *= -1;
            specs.y += (specs.speedY/Math.abs(specs.speedY))*5;
        }
        if(collision){
            specs.speedX += (specs.speedX/Math.abs(specs.speedX)) * INCRIMENT_SPEED;
            specs.speedY += (specs.speedY/Math.abs(specs.speedY)) * INCRIMENT_SPEED;
        }
        specs.x += specs.speedX * deltaTime;
        specs.y += specs.speedY * deltaTime;
    }
    return specs;
}

function paddle(_specs){
    var specs = (!_specs) ? entity() : _specs;
    specs.width = PADDLE_WIDTH*width;
    specs.height = PADDLE_HEIGHT*height;
    specs.y = (height/2) - (specs.height/2);
    specs.speedY = PADDLE_SPEED_Y;

    specs.moveDown = function(){
        specs.y += specs.speedY* deltaTime 
        if(height < specs.y + specs.height) specs.y = height - specs.height;
    }
    specs.moveUp = function(){
        specs.y -= specs.speedY * deltaTime;
        if(specs.y < 0) specs.y = 0;
    }
    
    specs.reset = function(){
        specs.y = (height/2) - (specs.height/2);
    }

    specs.update = function(){
        specs.handleInput();
        ctx.fillStyle = globalColor();
        ctx.fillRect(specs.x, specs.y, specs.width, specs.height); 
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(specs.x, (specs.y - 5) , 2*specs.width/3, specs.height + 10); 
    }

    return specs;
}

function player1(){
    var specs = paddle();
    specs.handleInput = function(){
        if(touchY){ 
            if(touchY < specs.y) specs.moveUp();
            if(touchY > specs.y+specs.height) specs.moveDown();
        }
        if( keys && (keys[38] || keys[40])) keys[38] ? specs.moveUp() : specs.moveDown();
    }
    return specs;
}

function player2(){
    var specs = paddle();
    specs.x = width - specs.width;
    specs.handleInput = function(){
        var ball = entities["ball"];
        //(ball.y > specs.y + (specs.width/2)) ? specs.y += specs.speedY : specs.y -= specs.speedY
        //ball.speedY > 0 ? specs.moveUp() : specs.moveDown();
        if(ball.y < specs.y && ball.speedY < 0) specs.moveUp();
        if(ball.y > specs.y && ball.speedY > 0) specs.moveDown();
    }
    specs.update = function(){
        specs.handleInput();
        ctx.fillStyle = globalColor();
        ctx.fillRect(specs.x, specs.y, specs.width, specs.height); 
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(width-2*specs.width/3, specs.y - 5, 2*specs.width/3, specs.height + 10);    
    }
    return specs;

}

function drawGUI(){
    ctx.fillStyle = globalColor();
    //Draw Boundaries
    ctx.strokeStyle = globalColor();
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(0,1);
    ctx.lineTo(width, 1);
    ctx.moveTo(0, height-1);
    ctx.lineTo(width, height-1);
    ctx.stroke();
    ctx.font = "2em Arial";
    //Player 1
    ctx.textAlign = "end";
    ctx.fillText(player1Score, (width/2) - 50, height/2);
    //Player 2 
    ctx.textAlign = "start";
    ctx.fillText(player2Score, (width/2) + 50, height/2);

    //Display Timer
    if(timer > 0){
        ctx.font = "3em Arial";
        ctx.textAlign = "center"
        ctx.fillText(Math.ceil(timer/1000.0), width/2, (height/2) - (entities["ball"].height/2));
    }
}

function computeDimensionsAndScale(){
    /*var dHeight = $(window).height() - $('.main').height();
    var best = Math.min(dHeight, $('.main').width());

    width = best;
    height = best;
    ctx.scale(width/500, height/500);*/
    var canvas = $('canvas');
    //Remove canvas from height calculation
    canvas.attr('width', 0);
    canvas.attr('height', 0);
    var dWidth = $('.main').width();
    var dHeight = $(window).height() - $('.main').height();
    var best = Math.min(dHeight, dWidth);
    canvas.attr('width', best);
    canvas.attr('height', best);
    width = best;
    height = best;
    console.log(dWidth, dHeight, best);
}

//Setup
function setup(){
    canvas = $('#canvas');
    ctx = canvas[0].getContext('2d');
    computeDimensionsAndScale();
    //Correct width and height of html canvas to match css
    canvas.attr('width', width);
    canvas.attr('height', height);

    //Setup Input
    keys = [];
    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = true;
    });

    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = false; 
    });

    window.addEventListener('touchstart', getTouchPos);
    window.addEventListener('touchend', liftFinger);

    entities = { 
        "player1": player1(),
        "player2": player2(),
        "ball": ball()
    }; 

    timer = START_TIME;
    game_start = false;
}

//Clear Canvas
function canvasClear(){
    ctx.clearRect(0,0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
}

function newRound(){
    entities["player1"].reset();
    entities["player2"].reset();
    entities["ball"].resetBall();
    timer = START_TIME;
    game_start = false;
    touchY = undefined;
}

function manageGame(){
    var ball = entities["ball"];
    //Check if someone scored
    if(ball.x < 0 || ball.x + ball.width > width){
        (ball.x < 0) ? ++player2Score : ++player1Score;
        newRound();
    }
    //decrement start timer
    timer -= (1000*deltaTime);
    //check if game has started
    if(!game_start && timer <= 0){
        game_start = true;
        ball.resetDirection();
    }

}
//Update
function update(){
    canvasClear();
    drawGUI();    
    //Calculate delta time
    deltaTime = (Date.now() - timeEllapsed)/1000;
    for(var i = 0; i < Object.keys(entities).length; i++){
        var cur = entities[Object.keys(entities)[i]];
        cur.update();
    }
    manageGame();
    timeEllapsed = Date.now();

}

/*Main*/
$(document).ready(function(){
    //Init the color on the page
    addColorPeriods();
    //Change Colors Every 5 seconds
    window.setInterval(
        function(){
            changeColors(++curColor % colors.length);
        }, 
    5000);
    /*Setup*/
    /*if($('#canvas')){
    setup();
    //Start loop
    timeEllapsed = Date.now();
    if(width < MIN_DIM || height < MIN_DIM)
        $('#canvas').remove(); 
    else 
        ctx.interval = window.setInterval(update, FRAME_RATE);
    }*/
});
