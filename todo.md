# VideoGround-beta-world video files todo list

## () - worldPos.objectWrap and video-world-position-obj-wrap.js
* (done) start a video-world-position-obj-wrap.js video

## () - worldPos.fromLand
* start a worldPos.fromLand method
* the from land method will use rayCaster and should be based off of what I worked out for video8

## () - canvas textures for world.dae
* canvas textures are not working with world.dae, see about fixing that ( see what the deal is with uvs first ).

## () - guy-characters.js
* start a guy-characters.js file to quickly create custom guy objects with textures and addtional mesh objects
* have a GuyCharacter.create method to create one of two guy characaters
```
var guy1 = GuyCharacter.create('guy1');
var guy2 = GuyCharacter.create('guy2');
scene.add(guy1);
scene.add(guy2);
```
* maybe also a single createGuys method that can then be used like this:
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
