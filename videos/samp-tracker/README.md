# samp-tracker

This is my first take at making a music tracker program working on top of R0 of my samp-create javaScript module in the main JavaScript folder of this beta world collection of video content. For this project at least the aim is to not just jump into anything to complex, as even when it comes to the core basics there are a whole lot of little details I am going to want to get solid first. So then I am not going to worry so much about things like mixing up to 24 notes per track, many tracks, waveform parameter tables, common parameter tables, so forth and so on. This project will then just be used to make a few videos that make use of one waveform function, one note at a time, single track, with a fixed set of waveform parameters. In other words, simply put, I just want to have a 'hello world example of a music tracker program' if that makes any sense.

* (done) I will just want a basic music roll format to start with
* (done) Just a single main roll of data rather than patterns
* (done) store the music roll in an external file format
* (done) just one channel
* (done) fixed values for waveform options, and common options
* (done) get waveform index values working by having a map for waveform functions
* (done) blank lines can be used to carry a note
* (done) get amp values working
* (done) display waveform and amp values
* (done) I want at least one common param that is used to set the waveform alpha

* () I want to get the final wave alphas to be in sync with per second, rather than per set of lines

<!-- maybe? -->
* () have a fixed 0-99 scale for amplitude
* () have a fixed 0-99 scale for waveform index
* () '' and '--- -- --' strings having the same meaning
* () '--- -- -0' in place of lines like 'b-3 1 0.00' but both should still work



* () I will still want a header to set BBM, and what the waveform map should be for a music roll

## Music roll format

I want to get at least some kind of music roll format started first and foremost, before moving on to any more advanced projects that might end up based on what I am starting here. 

I am going to just go with something that is similar to what is used in OpenMPT, but will of course make any changes I want or need to make while moving forward with this. Thus far one key difference is that I am going to think in terms of waveform index values, rather than sample index values as I want to work with pure functions that are used to set sample values rather than sound files.

This video explains what the deal is with the Music roll format in OpenMPT well about 2:45 in.

https://www.youtube.com/watch?v=6IxSL1zrLDo

### Plain text format

I want to go with a plane text format that is and try to stick in the ASCII range on top of that was well if I can manage to do so. The files can just be saved as plane text without any extension if using Linux only, or maybe with the txt extension so that the files are still windows friendly. With that said the line breaks can be Linux or Windows style breaks and each new line that is not commented out will be treated as a time row index.

### First three values for a line ( pitch, waveform_index, and amplitude )

To save you the click here the basic idea here is that the first value will be the note to play, the second will be what to play which in this case will be the waveform function to use defined in a map. The third value in a line will then be the current amplitude value to set.

```
c-0 0 1.00
```

### Comments

I will want to have a comment system, for this I will just go with what is used in bash scripts which means to just start a line with \#. I do not have any plans for a multi line system so if I need to comment out a large section I will just need to put one of these for every line for that kind of deal.

```
# samp-tracker music roll format
# [note_index] [waveform_index] [amp] [params]
c-0 0 1.00
c#0 0 1.00
d-0 0 1.00
d#0 0 1.00
e-0 0 1.00
f-0 0 1.00
f#0 0 1.00
g-0 0 1.00
g#0 0 1.00
a-0 0 1.00
a#0 0 1.00
b-0 0 1.00
```

### common parameters

I said that I will not be getting into anything to advanced with waveform parameters with this project, however I think that I am still going to want a few common parameters for things like setting how long a note should play for if no updated data is given for a line.