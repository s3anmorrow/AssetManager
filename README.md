assetManager
============

AssetManager is a reusuable object for preloading and working with all your bitmap game assets in an HTML5 game. Requires CreateJS (easelJS 0.7.1 / preloadJS 0.4.1). 

USAGE:
> Construct AssetManager object once and give it a global scope (or pass it around to different game objects)
> Call loadAssets(manifest) method and provide loading manifest as argument
> AssetManager will handle preloading all assets (images or sound)

Manifest can take two different approaches:
Simple Approach:
var manifest = [
   {src:"lib/Snake.png", id:"Snake", data:{
   width:108, height:73, regPoint:"TopLeft",
   animations:{alive:[0,11], dead:[12,39]}}}
];
> regPoint can be "TopLeft" or "Center"
> you can omit the animations if the sprite only contains one animation sequence
var manifest = [
   {src:"lib/Snake.png", id:"Snake", data:{
   width:108, height:73, framecount:20, regPoint:"TopLeft",
   animations:{}}}
];
> in this case you can add a count property to specify exactly how many frames your animation lasts.
Not usually required, however if the spritesheet has any blank frames at the end they will be included
in the animation without the inclusion of the frame count property
> disadvantage of this approach is that you can't really mix up different sprites on the same sprite sheet which
results in a lot more spritesheets needing to be downloaded on game startup

Detailed Approach:
var manifest = [
 {src:"lib/Snake.png", id:"Snake", data:{
      frames:[
          [0, 0, 128, 128, 0, -2, 1],
          [128, 0, 128, 128, 0, -2, 1],
          [256, 0, 128, 128, 0, -2, 1],
          [384, 0, 128, 128, 0, -2, 1],
          [512, 0, 128, 128, 0, -2, 1],
          [640, 0, 128, 128, 0, -2, 1],
          [768, 0, 128, 128, 0, -2, 1],
          [0, 128, 128, 128, 0, -2, 1],
          [128, 128, 128, 128, 0, -2, 1],
          [256, 128, 128, 128, 0, -2, 1],
          [384, 128, 128, 128, 0, -2, 1],
          [512, 128, 128, 128, 0, -2, 1],
          [640, 128, 128, 128, 0, -2, 1],
          [768, 128, 128, 128, 0, -2, 1],
          [0, 256, 128, 128, 0, -2, 1],
          [128, 256, 128, 128, 0, -2, 1],
          [256, 256, 128, 128, 0, -2, 1],
          [384, 256, 128, 128, 0, -2, 1],
          [512, 256, 128, 128, 0, -2, 1]
      ],
      animations:{
          alive: {frames: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], speed: 1},
          dead: {frames: [3,4,5,6,7,8,9,10,11,12,12,12,12,12,12,12,12,12,12,12,12,12,13,14,15,16,17,18],speed: 1}
      }
  }}
];
> this data was generated from a SWF with CreateJS ZOE but allows different sized frames to be included in one spritesheet
> ultimately this approach allows you to use one Spritesheet for a large number of different sprites
> note that when using zoe all your sprite animations need to be on the main timeline with frame labels
> you also want to include an empty movieclip with instance name "registrationPoint" to mark where reg point is located

> to get a sprite at anytime call getClip(id) and provide id of sprite you want to retrieve and it returns the sprite for usage
