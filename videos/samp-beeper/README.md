# samp-beeper

This is another start with 1-bit music, or beeper music, maybe this time though I will follow threw with this one though as I want to start a few projects where I keep making more videos for the collection indefinitely rather than just experimenting with an idea and then moving on.

* start out with some draft videos where I just want to work out what the core idea should be to begin with
* once I have a good core system make a number of test videos, at least 3 but as many as 10
* start a whole other videoground content collection based on what I started here.

## samp-beeper-upscale

Another idea for working out how to do this would be to, well, cheat. It is not like I am making 1-bit sound for some kind of retro system where I really only have 1-bit sound to work with, I am making sound that will be published to Youtube. Sense I am publishing to Youtube I will need to upscale the sound to at least 16-bit sound anyway, so why not have a system where I am just working with 1-bit tracks, but when it comes to mixing them allow myself to just do so within the full range of what 16-bit should can do in terms of amplitude. This of course will address a lot of the mixing problems, make things easier, and also allow for all kinds of interesting things in terms of how to go about doing this sort of thing. For example I can keep things restricted to a certain number of indexed amplitudes, or do interesting things like treating final 1 bit values as a kind of peak amplitude with a sawtooth like waveform rather than pulse.

However for now I think that it might be best to start this as a whole other project, and keep samp-beeper as a collection of videos that has to do with just single 1-bit tracks that are just upscaled only, and stay as pulse wave, noise, ect when doing so.


# Draft Videos

Before I even publish the first video I am going to want to draft out a few ideas of how I should even go about doing this sort of thing to begin with.

### videoxx-01-draft-frame-slots

The first draft video that I started for this collection had to do with working out this frame slot system of sorts. This works by breaking each frame down into a collection of slots, and then each slot is broken down into one or more sections for each track. This might prove to work better than just breaking down a frame into an even number of parts, but I can not say that I am happy with it. For this kind of system I might want to break free from doing things on a frame by frame basis, and go back to figuring things on a per second kind of thing.

### videoxx-02-draft-persec

The next draft video idea is to break away from frame by frame in favor of second by second processing of music roll data. Also I want to do away with a fixed number of slots and tracks per frame in favor of a variable number of sections. This should allow for a greater deal of freedom that I will need to get things to sound right.

### videoxx-03-draft-merge-down

One simple way to go about having more than one track would be to just merge down. What is nice about this is that it makes things far more simple in the sense that I can just work out what each track should be and then merge down into one. The down side of this is that we are talking 1 bit sound, so if I have say three tracks I can not just add them up and average or do whatever to mix as there is just not enough amplitude for that. Things will not sound so bad if I am just careful as to what track will be the top most track, I am thinking that percussion should be that.

## videoxx-04-draft-roll-format

The goal here is to just work out a simple music roll format, working on top of the merge down idea when it comes to mixing tracks. For now I can just bake the roll format into the js file as the focus will not be on display, or reading any kind of final external file format just yet as that might be what I will want to work out for the final reader video.

* (done) I want to start a samp-tracker-1bit.js file based on what started in the samp-tracker project
* () I will want to do away with amplitude values for each line as they are not needed for this application
* () I will want to allow for more than one track per line



