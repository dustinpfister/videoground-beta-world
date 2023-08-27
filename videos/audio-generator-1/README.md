# audo-generator-1

This is a collection of video files in which I am working out some basic tools to help me with new features in videoground R10 that allow for me to render data along with the usual frames. There are maybe a lot of use cases for this, but the main aspect of interest with this is to render audio sample data that I can then playback with the Linux aplay command.

If you are using a Linux system with ALSA set up, then chances are you have the aplay command that can be used to play any data as audio sample data. You can read a file with it, or pipe in data to aplay by way of the standard input. For example the cat command can be used to read some random data, and then that can be piped into aplay.

```
$ cat /dev/random | aplay -d 3
Playing raw data 'stdin' : Unsigned 8 bit, Rate 8000 Hz, Mono
```

By default the data will be treated as 8bit Unsigned samples at a rate of 8 kHz, or in other words 8,000 bytes per second where each byte value is a sound sample. There are of course many options for changing the sample depth, sample rate, as well as the number of channels and so forth.

However the main focus with this project has to do with writing code that will generate data that can then be used with aplay, or a similar command. Regardless of what the sample depth and rate is there are things like waveforms, wave tables, harmonics, and so forth. I will then want to at least start some JavaScript files that contain code that I can use to create sounds. I am sure that I will not get every little detail solid with this project, but I have to start somewhere when it comes to this.

## What the main goals with audo-generator-1 are

The goals with this first collection of videos should be to work out a first set of tools to make videos that have to do with audio synthesis. After that I will want a few demo videos in which I am just testing out that these tools are working okay for a few use case examples. Nothing major or final this time around, just the first collection of files to which I will then refine in future collections like this.

### Harmonics

Harmonics and Standing waves

https://www.youtube.com/watch?v=0Rfushlee0U&pp=ygUJaGFybW9uaWNz

### waveform functions, for_sampset functions, and wave alphas

The final format for this project will be that I will want to use a built in waveform function, or create a custom one. After that the other main function of interest is the for\_sampset function that is used to adjust settings that effect how this waveform function will create a final sample value. I am sure that there is a whole would of other ways of doing this sort of thing, but as far as this project is concerned that will be how it is done for better or worse.

If you look at one of the video files such as the sin waveform video you will see something to this effect.

```js
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'sin',
        for_sampset: ( sampset, i, a_sound, opt ) => {
            sampset.a_wave = a_sound * opt.secs % 1;
            sampset.amplitude = 0.75;
            sampset.frequency = 80;
            return sampset;
        },
        secs: 10
    });
```

I am using the built in sin waveform function, and with that I will want to set what the values are of the a\_wave value, along with amplitude and frequency. The expression that I am using for wave alpha value is actually what the default is, I am just making it explicit here. This expression will be what I would end up wanting for many of the videos that I will be making on top of the tools, but there might be a few exceptions. If I do go with some other way to set the alpha I will want to take care in how that will effect frequency, for example the bellow demo code will give the same end effect.


```js
    const sound = scene.userData.sound = CS.create_sound({
        waveform : (sampset, a_wave ) => {
            return Math.sin( Math.PI  * 2 * sampset.frequency * a_wave )  * sampset.amplitude;
        },
        for_sampset: ( sampset, i, a_sound, opt ) => {
            sampset.a_wave = a_sound;
            sampset.amplitude = 0.75;
            sampset.frequency = 80 * opt.secs;
            return sampset;
        },
        secs: 10
    });
```


### JS files

There are three main JavaScript files that I have thus far that include a file with JavaScript code that is used to create audio sample data, a file to draw sample data, and a common utility library that I use between the two as well as in the various video files.

* have a samp\_tools.js file that will be a collection of common methods used by all libs of concern.
* have a samp\_create.js file that contains code for generation of audio sample data by way of algorithms.
* have a samp\_draw.js file that will draw sample data to one or more display areas of a canvas.

### Video files working on top of the tools

On top of making the basic tools I will also want to make a number of video files in which I am testing out the tools. These will include videos in which I am just testing out a kind of waveform such as sine wave, or a kind of use case on top of everything such as a kind of timeline system that can be used to create music.

## Methods for drawing sample data of a whole sound in a small display area.

One thing that can turn out to be a major rabbit hole with this I have found thus far has to do with working out a system for representing a whole sound that is several seconds, and maybe even minutes long, in a display area that is maybe only a few pixels wide. Of course it will not involve looping over all sample data as that will just take way to much overhead, that's okay because I just want an representation. Still this brings up the question as to how to go about making a method that involves creating just one sample from a massive collection of other samples? That is indeed a good question with no true, absolute answer it would seem.

As far as this video project collection is concerned I think I will just be going with sudo-random selection of a single sample, from the total sum of samples for a given point in the display. This is a flawed way of doing it, but nothing will be perfect with this of course. One nice thing about it though is that this way of doing it will prove to be very efficient to say the least as I am just grabbing a random sample from a total for a pixel. There might be better ways of doing this that might prove to be a little more accurate, but I do  not care to sink to much time into this one, at least at this time

This stack overflow post brings up a lot of good points to keep in mind if I aim to revisit this at some point.

https://stackoverflow.com/questions/11677246/drawing-zoomable-audio-waveform-timeline-in-javascript