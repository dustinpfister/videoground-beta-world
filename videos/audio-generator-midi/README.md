# audo-generator-midi

Another project folder in which I am expanding with what I started with in audio-generator-1, this time the main focus is on midi files. For the most part I think that this will be just importing midi files rather than exporting, I might cross that bridge when and if I come to it, but as of this writing I just want to read midi files on the open web.

## GOALS

The goals of this project are then to continue with what I all ready started with in audio-generator-1, but now the focus is more so on reading data in midi files and using that data to set tone and timing when creating sample data.

The goals of audo-generator-midi are then:

* (done) Use a lib such as midi-parser-js to parse midi files to a JSON format
* (done) use the data JSON data to create a tune using the tools that I have made thus far
* (done) I will want to play two notes at the same time in a midi file

<!-- clean up, readability -->
* () have folders for each javascript file in main js folder for the project folder
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