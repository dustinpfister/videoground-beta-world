# timer-hiit

## ( ) - video6-newlook.js
* () have trans in as well as trans out effects
* () have a scale effect for the numbers as well.
* () have the direction of the waves change with each interval over time by way of wave update option setting
* () wave height should change over time with higher waves for high intensity parts of intervals
* () see about more than one canvas texture for the waves, one updates over time and the background does not

## ( ) - video5-cdr1.js
* (done) see about updating to count-down.js R1
* (done) see about having a seconds display for the interval part as well.
<!-- NUMS DAE FILE -->
* () I will want a new cd5-nums.dae, and and updated depth 256 skin that will include a forward slash

## ( done 02/16/2023 ) - video4-ratio.js
* (done) start a video4-ratio file where I will be fixing some core problems with the ratio of time
* (done) I should be able to adjust the amount of time with an INTERVAL-RATIO setting
* (done) INTERVAL-RATIO setting can be a THREE.Vector2
* (done) HAVE a INTERVAL-START-HIGH setting that is a Boolen that when true will result in each interval starting high rather than low
* (done) fix transition issue so that it happens when the full set on intervals are over
* (done) fix camera looping so that it goes by the part of the current interval, rather than the current interval
* (done) transparent material for waves
* (done) canvas textures for waves
* (done) higher poly torus
* (done) there should be a warm up part to the video that comes after the delay part
* (done) white to blue or red color in warm up part depeding on INTERVAL-HIGH-START setting
* (done) have a textures section, and have both canvas textures there

## ( done 02/15/2023 ) - video3-waves.js
* (done) add the r1 of the wave module from threejs-examples-waves
* (done) start a sinwave to the scene by using the wave module to create a geometry.
* (done) go with a mesh object and the Phong material for the waves
* (done) WAVE-LOOPS-MIN and WAVE-LOOPS-MAX const values
* (done) have the speed at which the sin wave moves go up with each interval
* (done) have the speed of the wave go from max to min in cool down part
* (done) fix wave jump problem when going switching between high and low intensity
* (done) have the color of the wave mesh change from interval to interval
* (done) have the color of the wave mesh change for count down and cool down parts

## ( done 02/14/2023 ) - video2-camera.js
* (done) start a video2-camera.js file where I will just be working out some logic for camera movement
* (done) work out a simple opening camera movement for COUNT DOWN part
* (done) Color goes from purple to blue in cool down part
* (done) create a helper method that will create a curve for a camera position for a given interval
* (done) have a CAMERA-INTERVAL-LOOPS-MIN setting
* (done) have a CAMERA-INTERVAL-LOOPS-MAX setting
* (done) use the CAMERA-INTERVAL-LOOPS-... to set what the number of loops should be for each interval

## ( done 02/13/2023 ) - video1-core.js done
* (done) have opacity effects from delay > intervals > cooldown
* (done) create mesh with torus geometry behind the count down wrap
* (done) have a vertex color attribute for the torus geometry
* (done) change the state of the vertex color attribute as a way to display the progress of the current interval
* (done) have color arguments for updateTimeTorus helper
* (done) switch between blue and cyan to help let people know if this is a high or low intensity interval
* (done) thum mode worked out
* (done) count up for cool down part

## ( done 02/12/2023 ) - video1-core.js started
* (done) start a video1-core.js file where I would like to just find out what the core idea of this is
* (done) loose the ground dae scene file for the scene DAE
* (done) do not bother with curve paths for anything at this time
* (done) I will want to have a count down seg object that will be a delay to start
* (done) I will then need a number of interval seg objects that is created by a SETTINGS
* (done) the alarm seg part can say but will be used as a kind of cool down part of the video
