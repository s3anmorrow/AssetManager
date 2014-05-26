/*
* AssetManager class
* Sean Morrow
* May 6 / 2014
*
* USAGE:
* > Construct AssetManager object once and give it a global scope (or pass it around to different game objects)
* > Call loadAssets(manifest) method and provide loading manifest as argument
* > AssetManager will handle preloading all assets (images or sound)
*
* Manifest can take two different approaches:
* Simple Approach:
* var manifest = [
*     {src:"lib/Snake.png", id:"Snake", data:{
*     width:108, height:73, regPoint:"TopLeft",
*     animations:{alive:[0,11], dead:[12,39]}}}
* ];
* > regPoint can be "TopLeft" or "Center"
* > you can omit the animations if the sprite only contains one animation sequence
* var manifest = [
*     {src:"lib/Snake.png", id:"Snake", data:{
*     width:108, height:73, framecount:20, regPoint:"TopLeft",
*     animations:{}}}
* ];
* > in this case you can add a count property to specify exactly how many frames your animation lasts.
* Not usually required, however if the spritesheet has any blank frames at the end they will be included
* in the animation without the inclusion of the frame count property
* > disadvantage of this approach is that you can't really mix up different sprites on the same sprite sheet which
* results in a lot more spritesheets needing to be downloaded on game startup
*
* Detailed Approach:
* var manifest = [
*   {src:"lib/Snake.png", id:"Snake", data:{
*        frames:[
*            [0, 0, 128, 128, 0, -2, 1],
*            [128, 0, 128, 128, 0, -2, 1],
*            [256, 0, 128, 128, 0, -2, 1],
*            [384, 0, 128, 128, 0, -2, 1],
*            [512, 0, 128, 128, 0, -2, 1],
*            [640, 0, 128, 128, 0, -2, 1],
*            [768, 0, 128, 128, 0, -2, 1],
*            [0, 128, 128, 128, 0, -2, 1],
*            [128, 128, 128, 128, 0, -2, 1],
*            [256, 128, 128, 128, 0, -2, 1],
*            [384, 128, 128, 128, 0, -2, 1],
*            [512, 128, 128, 128, 0, -2, 1],
*            [640, 128, 128, 128, 0, -2, 1],
*            [768, 128, 128, 128, 0, -2, 1],
*            [0, 256, 128, 128, 0, -2, 1],
*            [128, 256, 128, 128, 0, -2, 1],
*            [256, 256, 128, 128, 0, -2, 1],
*            [384, 256, 128, 128, 0, -2, 1],
*            [512, 256, 128, 128, 0, -2, 1]
*        ],
*        animations:{
*            alive: {frames: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], speed: 1},
*            dead: {frames: [3,4,5,6,7,8,9,10,11,12,12,12,12,12,12,12,12,12,12,12,12,12,13,14,15,16,17,18],speed: 1}
*        }
*    }}
*];
* > this data was generated from a SWF with CreateJS ZOE but allows different sized frames to be included in one spritesheet
* > ultimately this approach allows you to use one Spritesheet for a large number of different sprites
* > note that when using zoe all your sprite animations need to be on the main timeline with frame labels
* > you also want to include an empty movieclip with instance name "registrationPoint" to mark where reg point is located
*
* > to get a sprite at anytime call getClip(id) and provide id of sprite you want to retrieve and it returns the sprite for usage
*/

var AssetManager = function() {
	// keep track of assets
    var manifest = null;
	var counter = -1;
	var total = -1;
	// array of spritesheet objects
	var spriteSheets = [];
	//var sounds = [];
	// preloader object
	preloader = new createjs.LoadQueue();

	// construct custom event object and initialize it
	var eventAssetLoaded = new createjs.Event("onAssetLoaded");
	var eventAllLoaded = new createjs.Event("onAssetsLoaded");

	// ------------------------------------------------------ event handlers
	onLoaded = function(e) {
		// what type of asset was loaded?
		switch(e.item.type) {
			case createjs.LoadQueue.IMAGE:
				// spritesheet loaded
				var source = e.item.src;
				var data = e.item.data;
                var framesData = null;

                if ((data.regPoint === undefined) && (data.width === undefined) && (data.height === undefined)) {
                    // the manifest contains a frames array (outlines dimensions, reg point, etc for EACH frame)
                    // this approach is used if you want to have ALL your assets in large files. Use CreateJS ZOE to generate the JSON
                    framesData = data.frames;
                } else {
                    // the manifest contains a frames object outlining properties of all frames in sprite
                    // determine registration point of sprite
                    var x = 0;
                    var y = 0;
                    if (data.regPoint == "center"){
                        x = Math.floor(data.width/2);
                        y = Math.floor(data.height/2);
                    }
                    // construct frames property object
                    framesData = {width:data.width, height:data.height, regX:x, regY:y};
                    // add in count property if provided
                    if (data.framecount !== undefined) framesData.count = data.framecount;
                }

                // construct Spritesheet object from source
				spriteSheet = new createjs.SpriteSheet({
                    images:[source],
					frames:framesData,
					animations: data.animations
				});

				// store spritesheet object for later retrieval
				spriteSheets[e.item.id] = spriteSheet;

				break;
			case createjs.LoadQueue.SOUND:
				// sound loaded
				// not sure we need with SoundJS
				//sounds.push(e.result);
				break;
        }
        // keeping track of how many loaded?
        counter++;
        // an asset has been loaded
        stage.dispatchEvent(eventAssetLoaded);
        console.log("asset loaded: " + e.result.src);
	};

	//called if there is an error loading the spriteSheet (usually due to a 404)
	onError = function(e) {
		console.log("Preloader > Error Loading asset");
	};

	onComplete = function(e) {
		if (counter >= total) {
			// dispatch event that all assets are loaded
			stage.dispatchEvent(eventAllLoaded);
        }
	};

	// ------------------------------------------------------ public methods
	this.getClip = function(id) {
		// construct sprite object to animate the frames (I call this a clip)
		var sprite = new createjs.Sprite(spriteSheets[id]);
		sprite.name = id;
		sprite.x = 0;
		sprite.y = 0;
		sprite.currentFrame = 0;
		return sprite;
	};

    this.getSpriteSheet = function(id) {
        return spriteSheets[id];
    };

	this.getProgress = function() {
		return (counter/total);
	};

	this.loadAssets = function(myManifest) {
		// setup manifest
        manifest = myManifest;
		counter = 0;
		total = manifest.length;
		// registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
		preloader.installPlugin(createjs.SoundJS);
        preloader.on("fileload", onLoaded);
        preloader.on("error", onError);
        preloader.on("complete", onComplete);
		preloader.setMaxConnections(5);
		// load first spritesheet to start preloading process
		preloader.loadManifest(manifest);
	};
};
