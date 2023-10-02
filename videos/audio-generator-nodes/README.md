# audo-generator-nodes

Another idea for this kind of audio generator project would be to create one where the main focus is on the topic of [nodes and anti nodes](https://en.wikipedia.org/wiki/Node_%28physics%29) in [standing waves](https://en.wikipedia.org/wiki/Standing_wave). For many of these projects I have been setting the start and end points of waveforms on a frame by frame basis, however I have also worked out some other methods that have to do with setting the start and end nodes on a note by note basis. Having a decent system for this is just one of many little details that I would like to get solid before moving on to starting a whole other repository for this kind of content alone, so I started this folder at least to park some notes for starters on this one.

## Main Goals

* To work out a decent system for breaking things down into variable start and end locations for waveforms
* I can still do frame by frame, and note by note, but also just define any two points in general
* A system simular to what is going on with MIDI might work fine for this actually, just time deltas and event types sort of speak

## Better display system for what is going on

Many of my audio generator projects feature a display that gives a visual representation of the whole video, and then usually at least another one that gives a frame by frame display of sample data. For this project though I am thinking that I should scrap all of that in favor of a display setup in which The whole video is broken down into a number of segments, and I then have a display that shows just the current segment. This display should then clearly show where all the nodes and anti nodes are in the current segment.

