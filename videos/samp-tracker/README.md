# samp-tracker

This is my first take at making a music tracker program working on top of R0 of my samp-create javaScript module in the main JavaScript folder of this beta world collection of video content. For this project at least the aim is to not just jump into anything to complex, as even when it comes to the core basics there are a whole lot of little details I am going to want to get solid first before flying off the rails. So I am not going to worry so much about things like mixing up to 24 notes per track, waveform parameter tables, so forth and so on. This will then just be used to make a few projects that make use of one waveform function, one note at a time, single track, with a fixed set of waveform parameters. In other words, simply put, I just want to have a 'hello world example of a music tracker program' if that makes any sense.

* I will just want a basic music roll format to start with
* store the msic roll in an external file

## Music roll format

I want to get a Music roll format solid first and formost before moving on to any more advanced projects. 

I am going to just go with something that is simular to what is used in OpenMPT, thus far the only key difference is that I am going to thing in terms of waveform index values, rather than sample index values.

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