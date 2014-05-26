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

// manifest of asset information
var manifest = [
    {src:"lib/Snake.png", id:"Snake", data:{
    width:150, height:98, regPoint:"center",
    animations:{alive:[0,11], dead:[12,39]}}},
    {src:"lib/Bug.png", id:"Bug", data:{
    width:30, height:38, regPoint:"center",
    animations:{alive:[0,11], dead:[12,29]}}}
];

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

    // startup the ticker
    createjs.Ticker.setFPS(gameConstants.FRAME_RATE);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // put your other stuff here!

    // update the stage!
	stage.update();
}

