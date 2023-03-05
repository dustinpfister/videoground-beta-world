# breathing-basic todo list

## () - video5-objectgrid.js
* () make use of the object grid wrap module
* () make it so that the grid objects move to the camera faster at high rest
* () make it so that the grid objects move to the camera slower at low reset
* () the grid objects speed up when breath in
* () the grid objects slow down and go alway from the camera for a little while durring breath out
* () like with the canvas background have the

## ( done 03/05/2023 ) - video4-bgactive.js
* (done) new canvas texture for background that will update over time
* (done) gradient background with color stops that update over time
* (done) have the background be a bunch of little dots that always move out from the center
* (done) a-gradient and a-dots alpha state object values for canObj-bg.
* (done) use ctx.ellipse over that of ctx.arc when drawing dots
* (done) add more dots, say 28 in total
* (done) have the opacity of each dot start out fully transparent when at the center
* (done) opacity of dots should become fully opaque at about 0.25 of unit length
* (done) the dots should always go outward
* (done) a-dots state value should be updated by an alpha value that will be consistant, per minute rather than over whole video

## ( done 03/03/2023 ) - video3-fgplane.js
* (done) have a for ground mesh object that is a plane geometry that always faces the camera
* (done) this can be based off of the s4-2-loop-plane-aspect from threejs-camera-perspective
* (done) have a canvas for this mesh object and use it to display a progress bars
* (done) display frame and max frame
* (done) have a progress bar for the whole video
* (done) have a progress bar for the current breath cycle
* (done) display time / totaltime
* (done) display Breaths Per Minute
* (done) display number of seconds for each breath cycle
* (done) display Breath Part Ratios as second values

## ( done 03/03/2023) - video2-circles.js
* (done) have a number of circles behind the main breath group
* (done) have the radius of the circles go up and down with the breath
* (done) have the opacity of the circles go up and down with the breath
* (done) textures for both orb and circles
* (done) canvas textures for circles material

## ( done 03/02/2023 ) video1-clean.js
* (done) start video1 with the template8 video4-breathr0.js
* (done) use custom methods for curveUpdate, meshUpdate
* (done) use custom hooks
