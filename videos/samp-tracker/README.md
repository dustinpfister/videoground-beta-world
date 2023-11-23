# samp-tracker

This is my first take at making a music tracker program working on top of R0 of my samp-create javaScript module in the main JavaScript folder of this beta world collection of video content. For this project at least the aim is to not just jump into anything to complex, as even when it comes to the core basics there are a whole lot of little details I am going to want to get solid first. So then I am not going to worry so much about things like mixing up to 24 notes per track, waveform parameter tables, so forth and so on. This will then just be used to make a few projects that make use of one waveform function, one note at a time, single track, with a fixed set of waveform parameters. In other words, simply put, I just want to have a 'hello world example of a music tracker program' if that makes any sense.

* (done) I will just want a basic music roll format to start with
* (done) Just a single main roll of data rather than patterns
* (done) store the music roll in an external file format
* (done) just one channel
* (done) fixed values for waveform options, and common options
* () I will then want look ahead and look back methods to find out what the wave alpha values should be for a line
* () blank lines can be used to carry a note

## Music roll format

I want to get a Music roll format solid first and foremost before moving on to any more advanced projects. I am going to just go with something that is similar to what is used in OpenMPT. Thus far the one key difference is that I am going to think in terms of waveform index values, rather than sample index values as I want to work with pure functions that are used to set sample values rather than sound files.
This video explains what the deal is with the Music roll format in OpenMPT well about 2:45 in.
https://www.youtube.com/watch?v=6IxSL1zrLDo

```
  tIndex noteIndex waveformIndex amp params
  1      C1        0             1   NA ( for samp-tracker at least )
  2                0             0
  3                0             0
  4                0             0
  5      C1        0             0
```