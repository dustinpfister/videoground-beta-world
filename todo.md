# VideoGround-beta-world video files todo list

<!-- general ideas -->

# Some things to keep in mind here
* follow a ruff scale of 1 = US Standard foot
* explore more than one idea for a collection of video content, do not get fixed on a single idea
* if you feel traped with one idea shift the focus to another idea


<!-- weird face one collection -->

## ( done 06/17/2022 ) - weird-face-one start working on dae file folder
* (done) start first dae file for a new dae folder
* (done) first dae file export for weird face one
* (done) start a new video14-weird-face-1 text video

## ( done 06/18/2022 ) - see about fixing mouth normals
* (done) fix isshues with mouth geometry

## ( done 06/19/2022 ) - update mouth geometry
* (done) See about making a mouth talk animation cycle that has to do with mutation of the position atribute of the mouth
* (done) start a mouths dae file that will contain a collection of mouse states
* (done) load both mouths and werid face 1 dae files in text video 14
* (done) see about setting the geometry of mouth to lerps between mouth-0 and mouth-1

## () - new mouth geo update method
* sense the method of lerping position attributes from one to another has failed, the next step is to try a new method for this
* look into how to go about doing this with 'bones' or any other kind of method that will work


<!-- cubescape-->

## () - cubescape-ep2-


<!-- ITEMS -->

## () - make any needed adjustments to chair and desk models for new guy2 model
* height of chair from bottom to area that the guy sits on should be about 1.5, but adjust so that the feet are on the ground
* height of desk legs should be maybe 2.5? Adjust this figure as needed until it just looks okay

<!-- GUY -->

## () - final set of textures for mrguy1, and mrguy2

## () - start mrguy2 textures

<!-- HOUSE 1 -->

## ( ) - house1-bedroom - fix face normals
* looks like the front side of the floor is facing out from the room, see about fixing that

<!-- DONE -->

## ( done 05/15/2022 ) - cubescape-ep1-dream - video2 custom effect
* (done) Add a simple CubeStack.loadEffect method for cube-stack.js
* (done) work out a custom effect for this video that has to do with rotation
* (done) use the custom effect for all cube stacks
* (done) I will want to have a way to make it so that textures are part of an effect

## (done 05/14/2022) - cubescape-ep1-dream video started
* (done) start first 'cubescape' video
* (done) move mouth for seq where the guy is talking
* (done) figure out how many frames I am going to want for each sequence
* (done) custom colors for cube srtacks
* (done) ground mesh
* (done) cyan background color
* (done) custom data for cube stacks around the guy in terms of where the cubes are

## ( done 04/06/2022 ) - house1-bedroom dae file
* (done) start a house1-bedroom project that will be a full 'bedroom only' scene of house1
* (done) start house1-bedroom with just the walls, and floor.
* (done) have a bed in the room
* (done) have the desk in the room
* (done) floor should be 12x9
* (done) there will be one doorway in the bedroom (0.5 from corner and 1 from ceiling)
* (done) there will be one window in the bedroom, with no view of outside for now.
* (done) export first dae for this

## ( done 03/26/2022 ) - guy2 pelvis
* (done) add a pelvix mesh for the guy2 model
* (done) update body uvs
* (done) update guy2-body texture
* (done) new pelvis.png
* (done) new guy2-pelvis.png

## ( done 03/23/2022 ) - guy2 adjust scale
* (done) adjust over all scale of guy so that the size is 6 units high

## ( done 03/19/2022 ) - bed dae folder
* (done) create a bed dae folder
* (done) just have a simple box area for this and move on for now

## ( done 03/12/2022) - start model for house1
* (done) start the house1 folder

## ( done 03/12/2022 ) - test-ico dae, and test video 10
* (done) Start a test test ico dae in the world folder where the aim is to just apply a texture to an ico sphere
* (done) start video10 that will just show the end result if a dae export

## ( done 03/10/2022 ) - start with textures for world-texture.dae
* (done) textures are not working with world.dae, see about fixing that in a new dae file world-texture-1.dae
* (done) start a world-texture-1 test video and use world-texture-1.dae in it
* (done) I might want more than one texture, grass and water for now

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
