# VideoGround-beta-world video files todo list
<!-- I MIGHT ALSO WANT THIS DONE -->

## () - guy-characters.js - createGuys method  
* have a single createGuys method that can then be used like this:
```
GuyCharacter.createGuys(scene);
var guy1 = scene.userData.guy1;
guy1.userData.canvasObj_face.draw({
   drawClass: 'face',
   drawMethod: 'talk',
   mouthPer: 0.5,
   leftEyeXPer: 0.5, rightEyeXPer: 0.5
});
```

## () - worldPos.objectWrap and video-world-position-obj-wrap.js
* (done) start a video-world-position-obj-wrap.js video

## () - worldPos.fromLand
* start a worldPos.fromLand method
* the from land method will use rayCaster and should be based off of what I worked out for 'video8 vg start video'

<!-- FIRST VIDEO -->

<!-- I WILL NEED THIS DONE TO START MAKING VIDEOS -->

## () - start at least place holder daes for all other aspects of 'beta-world'
* at least start a cow dae file
* at least start a billboard dae file
* dae files for a farm house, city areas, town hall
* at this point there should be enough to make e1 at least

## () - add guy2 to guy-characters.js
* add guy2 to guy-characters

## () - create crude models for airport, add to world-scene
* there needs to be a hanger
* there shoud be a control tower
* I will want a biplain model
* add these to world-scene


<!-- WORLD DAE FILE -->

## () - finish the two tree dae files, start world-scene
* have tree1.dae looking good
* have tree2.dae
* start a world-scene.dae file that will be a scene of the base world object, and trees.

## () - start a new world.dae this is larger
* figure out what the final size of the world should be

## () - start with uv for world-geo-groups.dae
* There should be a way to export a mesh that makes use of more than one material
* There should be a way to define groups for a geometry in blender


<!-- HOUSE 2 DAE -->

## () - HOUSE 2 
* start a house2.dae for guy2
* the 'house' for starters can just be a room and a hallway

