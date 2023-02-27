# template8-breathing todo list

## () new templae9-breathing-delay
* () I think that I will want a whole other template for adding a delay if I even bother
* () make dae-helper r0, and count-down.js r1 part of the stack
* () have a single count down object for the delay part

## () video4-alphas.js
* () the alpha values that ar used to move the breath spheres in and out should not be linear.

## () video3-holdtime.js
* () there should be at least some hold time for each breath

## () video2-curves.js
* (done) start a new video file where the focus is on the delay part of the video project
* (done) start with new logic where we are just moving the spheres during the delay part
* (done) use cubic bezier curve 3 in place of line curve for the createCurvePath helper
* (done) the start point for the control points can be the same outcome as line curve
* (done) mutation of control points over time in update mesh group helper
* (done) work out a nice starting example for control point deltas in update mesh group helper
* (done) have a setControlPoint helper
* (done) have a getControlRadius helper
* (done) have two deg values one for each control point in setControlPoints
* (done) video is to messy, start over as video2-curves.js and start a prototype for a module
* (done) have a breathGroup module with a create method
* (done) new breahGroup prototype has a update method as well.

* () adjust control points in breahGroup.update

* () use phong material when making mesh objects in createMeshGroup
* () add a directional light

* () remove delay part for this video, and maybe all videos for this template

## ( done 02/22/2023 ) video1-core.js
* (done) just start working out the core idea of what these videos should be about
* (done) have a collection of spheres that I can move in and out along curves
* (done) have a BREATHS-SECS const
* (done) have a BREATHS-PER-MINUTE const
* (done) have a DELAY-SECS const
