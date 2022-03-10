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

## () - start models for house1 and house2, add to world-scene
* have a quick house1.dae file for guy1
* have a house2.dae for guy2
* add these to world-scene

## () - finish the two tree dae files, start world-scene
* have tree1.dae looking good
* have tree2.dae
* start a world-scene.dae file that will be a scene of the base world object, and trees.

## () - start a new world.dae this is larger
* figure out what the final size of the world should be

## () - textures for world.dae
* textures are not working with world.dae, see about fixing that in a new dae file world-texture-1.dae
* I might want more than one texture (grass, water, road, ect)

## ( done 03/09/2022 ) - sequeneces.js
* (done) start a js file to help create a sequence object from a given over all per value in update.

## ( done 03/08/2022 ) - guy-characters.js started
* (done) start a guy-characters.js file to quickly create custom guy objects with textures and addtional mesh objects
* (done) have a GuyCharacter.create method to create one of two guy characaters

## ( done 03/08/2022 ) - worldPos.adjustObject and video-world-position-obj-adjust.js
* (done) start a worldPos.adjustObject method
* (done) use worldPos.adjustObject with an instance of the guy.js model in a new test video for this
* (done) have lat and long values cause the guy to move around in a circle on the surface
* (done) have heading adjust as it should

## ( done 03/08/2022 ) - world-position.js and video-world-position-basic.js 
* (done) rename guy1.js test video to guy-position.js
* (done) try to work out a solution for getting a interesting area with raycaster in guy-posiiton.js
* (done) delete video-guy-position
* (done) start new video-world-position video file
* (done) start world-position.js file
* (done) start a worldPos.fromSea method
* (done) start an obj1 mesh that will have the position set with worldPos.fromSea
* (done) there seems to be a bug when lon value is 1 see about fixing that

## ( done 03/05/2022 ) - js folder
* (done) start a js folder and copy over what I have so far that will work with r3 of the videoground prototype
* (done) start a guy1.js test video
* (done) make use of the canvas.js, guy.js, and guy-canvas.js files along with the world.dae file in guy1.js

## ( done 03/01/2022 ) - tree1 dae file
* (done) have a tree1 dae file that is just a box and a sphere

## ( done 02/28/2022 ) - world dae file started
* (done) start a world dae file
* (done) test video folder with a world rotate video file
