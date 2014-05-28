// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

// game variables
var stage = null;
var canvas = null;

// object to preload and handle all assets (spritesheet and sounds)
var assetManager, snake, bug;

var gameConstants = {
	"FRAME_RATE":26
};

// manifest of asset information - If you wish for this to be external I usually put it in a manifest.js file and link in with the HTML
// SIMPLE APPROACH Manifest
var manifest = [
    {src:"lib/Snake.png", id:"Snake", data:{
    width:150, height:98, regPoint:"center",
    animations:{alive:[0,11], dead:[12,39]}}},
    {src:"lib/Bug.png", id:"Bug", data:{
    width:30, height:38, regPoint:"center",
    animations:{alive:[0,11], dead:[12,29]}}}
];

/*
// DETAILED APPROACH Manifest
var manifest = [{
    src:"lib/assets.png",
    id:"Assets",
    data:{
        "frames":[[290, 80, 71, 17, 0, -5, -16],[219, 80, 67, 22, 0, -2, -13],[150, 80, 65, 25, 0, -4, -15],[670, 2, 27, 44, 0, -15, -9],[637, 2, 29, 51, 0, -20, -8],[603, 2, 30, 60, 0, -25, -4],[327, 2, 32, 66, 0, -29, -1],[194, 2, 35, 70, 0, -35, 1],[233, 2, 41, 70, 0, -40, 1],[278, 2, 45, 68, 0, -46, -1],[127, 2, 63, 74, 0, -49, 1],[2, 2, 60, 74, 0, -52, 1],[66, 2, 57, 74, 0, -55, 1],[411, 2, 44, 64, 0, -55, -5],[555, 2, 44, 64, 0, -55, -5],[459, 2, 44, 64, 0, -55, -5],[507, 2, 44, 64, 0, -55, -5],[363, 2, 44, 64, 0, -55, -5],[1007, 2, 0, 0, 0, 21, 13],[72, 80, 19, 29, 0, -9, -5],[95, 80, 22, 29, 0, -7, -5],[121, 80, 25, 29, 0, -7, -5],[701, 2, 21, 37, 0, -8, -1],[752, 2, 21, 37, 0, -8, -1],[726, 2, 22, 37, 0, -7, -1],[874, 2, 24, 37, 0, -5, -1],[844, 2, 26, 37, 0, -3, -1],[777, 2, 28, 37, 0, -2, -1],[902, 2, 31, 37, 0, 0, -1],[937, 2, 31, 37, 0, 0, -1],[972, 2, 31, 37, 0, 0, -1],[2, 80, 31, 37, 0, 0, -1],[809, 2, 31, 37, 0, 0, -1],[37, 80, 31, 37, 0, 0, -1]],
        "animations":{"bugAlive": {"frames": [19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21],"speed": 1},"snakeDead": {"frames": [3,4,5,6,7,8,9,10,11,12,12,12,12,12,12,12,12,12,12,12,12,12,13,14,15,16,17,18],"speed": 1},"snakeAlive": {"frames": [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], "speed": 1},"bugDead": {"frames": [22,23,24,25,26,27,28,28,28,28,28,28,29,30,31,32,33,18],"speed": 1}}
    }
}];
*/

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");

	// get reference to canvas
	canvas = document.getElementById("stage");
	// set canvas to as wide/high as the browser window
	canvas.width = 600;
	canvas.height = 600;
	// create stage object
    stage = new createjs.Stage(canvas);

	// construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener("onAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);
}

function onSetup() {
	console.log(">> setup");
	// kill event listener
	stage.removeEventListener("onAssetsLoaded", onSetup);

    // SIMPLE APPROACH Manifest
    // construct game objects
    snake = assetManager.getClip("Snake");
    snake.x = 200;
    snake.y = 200;
    snake.gotoAndPlay("alive");
    stage.addChild(snake);

    bug = assetManager.getClip("Bug");
    bug.x = 50;
    bug.y = 50;
    bug.gotoAndPlay("dead");
    stage.addChild(bug);

    /*
    // DETAILED APPROACH Manifest
    // construct game objects
    snake = assetManager.getClip("Assets");
    snake.x = 200;
    snake.y = 200;
    snake.gotoAndPlay("snakeAlive");
    stage.addChild(snake);

    bug = assetManager.getClip("Assets");
    bug.x = 50;
    bug.y = 50;
    bug.gotoAndPlay("bugDead");
    stage.addChild(bug);
    */

    // startup the ticker
    createjs.Ticker.setFPS(gameConstants.FRAME_RATE);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // put your other stuff here!
    // ...

    // update the stage!
	stage.update();
}

