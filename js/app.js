// Superclass
var Character = function(sprite, x, y, name) {
    //work on this.
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.name = name;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "15px Roboto";
    ctx.textAlign = "center";
    ctx.fillText(this.name, this.x + 50, this.y + 155);
};

//Subclasses
// Enemies our player must avoid
var Enemy = function(sprite, x, y, name, movement) {
    Character.call(this, sprite, x, y, name);
    this.movement = movement;
};

Enemy.prototype = Object.create(Character.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Remember: canvas.width = 505 | canvas.height = 606;

Enemy.prototype.update = function(dt) {
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
    if (this.x < 500){
        this.x += this.movement * dt;
    }
    else {
        //resets x direction off screen.
        //calculate a reset for this.
        this.x = -2;
        this.y = Math.random() * 184 + 50;
    }
    checkCollision();
};

// Player

var Player = function(sprite, x, y, name, movement) {
    Character.call(this, sprite, x, y, name);
    this.movement = 50;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.update = function(dt) {

    if (this.ctlKey === 'left' && this.x > 0){
        this.x -= this.movement;
    }
    else if (this.ctlKey === 'right' && this.x < 400){
        this.x += this.movement;
    }
    else if (this.ctlKey === 'up'){
        // Make sure you reset each time you reach the water.
        if (this.y < 40){

        this.reset(); // resets player

        level++; // adds to the current level
        score += level * 2; // adds to score, and adds more enemies
        console.log('current score: ' + score);
        console.log('current level: ' + level);
        increaseLevel(level); // adds more enemies based on score
        displayStats();
        }
        else {
            this.y -= this.movement;
        }
    }
    else if (this.ctlKey === 'down' && this.y < 400){
        this.y += this.movement;
    }
    this.ctlKey = null;
};

//Input handler for player
Player.prototype.handleInput = function(e) {
    this.ctlKey = e;
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

var increaseLevel = function(level) {
    allEnemies.length = 0;
    // list of names for the enemy
    var name = ['billy', 'Joel', 'Snickers', 'Homer', 'The terminator', 'ROBO-COP', 'Ice man', 'Finn', 'Jake', 'Final Boss'];
    // new set of enemies
    for (var i = 0; i < level; i++) {
        var enemy = new Enemy('images/enemy-bug.png', 0, Math.random() * 184 + 50, name[i], Math.random() * 256);
        allEnemies.push(enemy);
    }
    // Add 1 more enemy after level 5
    if (level > 5) {
        var enemy = new Enemy('images/enemy-bug.png', 0, Math.random() * 184 + 50, name[i], Math.random() * 256);
        allEnemies.push(enemy);
    }
};

var decreaseLevel = function() {
    if(allEnemies.length > 1){
        allEnemies.pop(enemy);
        level--; // adds to the current level
        score--; // adds to score, and adds more enemies
    }
}
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var checkCollision = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if(player.x >= allEnemies[i].x - 40 && player.x <= allEnemies[i].x + 40){
            if(player.y >= allEnemies[i].y - 40 && player.y <= allEnemies[i].y + 40){
                player.reset();
                decreaseLevel();
                displayStats();
                console.log('current score: ' + score);
                console.log('current level: ' + level);

            }
        }
    }
};

var displayStats = function() {
    document.getElementById('currentStats').innerHTML = 'Level: ' + level.toString() + " | " + 'Score: ' + score.toString();
    document.getElementById('numberOfEnemies').innerHTML = 'Enemies: ' + allEnemies.length.toString();
};

var allEnemies = [];
var player = new Player('images/char-boy.png', 200, 400, 'William');
var score = 0;
var level = 1;
var enemy = new Enemy('images/enemy-bug.png', -2, Math.random() * 184 + 50, 'Bob', Math.random() * 256);
allEnemies.push(enemy);
displayStats();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});