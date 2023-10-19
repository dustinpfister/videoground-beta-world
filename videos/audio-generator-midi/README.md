# audo-generator-midi

Another project folder in which I am expanding with what I started with in audio-generator-1, this time the main focus is on midi files. For the most part I think that this will be just importing midi files rather than exporting, I might cross that bridge when and if I come to it, but as of this writing I just want to read midi files on the open web.

## GOALS

The main goal then is to just use midi for frequency and timing and that is about it. When it comes to everything else then such as what waveform to use for what track, and what the waveform paramaters should be over time, and so forth, that will have to be set on a video by video basis. I will have to look into things more when it comes to midi, as well as other standards, if I find that I do have to make my own werid standard it will likley just be some kind of extension of midi anyway. In any case that is somehting that I might want to get into with a whole other project folder.

What has been done thus far:

* (done) Use a lib such as midi-parser-js to parse midi files to a JSON format
* (done) use the data JSON data to create a tune using the tools that I have made thus far
* (done) I will want to play two notes at the same time in a midi file
* (done) have folders for each javascript file in main js folder for the project folder

The goals of audo-generator-midi are then:

<!-- clean up, readability -->
* () have waveforms as additional files outside of samp-create js file
* () only built in waveform for samp-create.js is sin

* () I will want a samp\_tools_midi js file in which I will part all code I will want to use from one video file to the next
* () clean up all files, removing code that will not be used in this project
* () sound.array\_disp should not be part of a sound object, it should be its one file

<!-- tracks, tables, mixing -->
* () I will want to have more than one table waveform, or at least one good one that will work well with more than one note
* () I seem to have note mixing working okay, but now I need to figure out track mixing
* () I will want to be able to play more than one track

<!-- temo -->
* () I will want to be able to read what the temo is for a midi file, and use that as a way to set the length of the video

<!-- vishual look -->
* () I will want to have some kind of cool vishual look for this project, maybe make use of threejs features for this
* () One idea I have is to have a collection of mesh objects where each one is a note that is going to be played and then slide down over a plane.