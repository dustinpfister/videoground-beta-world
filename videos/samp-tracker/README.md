# samp-tracker

This is my first take at making a music tracker program working on top of R0 of my samp-create javaScript module.

* I should be able to define a colleciton of patterns
* each pattern should be a collection of events
* each event should be a event index, then addtional paramaters depending on the event index
* have a main file that is a kind of main index of patterns


### Event 0: Set Tempo event:

```
0 4
```

Will set the tempo to 4 beats per second

### Event 1: track setup

```
1 0 4 seedednoise 
```
will set track 0 to max notes of 4, and use the seedednoise waveform function.

### Event 2: Note on

```
2 0 0 c3
2 0 1 c3
2 0 1 c3
```