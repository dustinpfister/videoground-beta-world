# audo-generator-1

This is a collection of video files in which I am working out some basic tools to help me with new features in videoground R10 that allow for me to render data along with the usual frames. There are maybe a lot of use cases for this, but the main aspect of interest with this is to render audio sample data that I can then playback with the Linux aplay command.

## What the main goals with audo-generator-1 are

The goals with this first collection of videos should be to work out a first set of tools to make videos that have to do with audio synthesis in general. After that I will want a few demo videos in which I am just testing out that these tools are working okay for a few use case examples. Nothing major or final this time around, just the first collection of files to which I will then refine in future collections like this. For example there is starting another collection of videos like audio-generator-sinetunes where I create a set of tools just for making quick simple tunes with the sine wave form alone.

### What is the Linux ALSA aplay command ?

If you are using a Linux system with ALSA set up, then chances are you have the aplay command that can be used to play any data as audio sample data. You can read a file with it, or pipe in data to aplay by way of the standard input. For example the cat command can be used to read some random data, and then that can be piped into aplay.

```
$ cat /dev/random | aplay -d 3
Playing raw data 'stdin' : Unsigned 8 bit, Rate 8000 Hz, Mono
```

By default the data will be treated as 8bit Unsigned samples at a rate of 8 kHz, or in other words 8,000 bytes per second where each byte value is a sound sample amplitude value. There are of course many options for changing the sample depth, sample rate, as well as the number of channels and so forth.

However the main focus with this project has to do with writing code that will generate data that can then be used with aplay, or a similar command. Regardless of what the sample depth and rate is there are things like waveforms, wave tables, harmonics, and so forth. I will then want to at least start some JavaScript files that contain code that I can use to create sounds. I am sure that I will not get every little detail solid with this project, but I have to start somewhere when it comes to this.

## JS files

There are three main JavaScript files that I have thus far that include a file with JavaScript code that is used to create audio sample data, a file to draw sample data, and a common utility library that I use between the two as well as in the various video files.

* have a samp\_tools.js file that will be a collection of common methods used by all libs of concern.
* have a samp\_create.js file that contains code for generation of audio sample data by way of algorithms.
* have a samp\_draw.js file that will draw sample data to one or more display areas of a canvas.


### Methods for drawing sample data of a whole sound in a small display area.

One thing that can turn out to be a major rabbit hole with this I have found thus far has to do with working out a system for representing a whole sound that is several seconds, and maybe even minutes long, in a display area that is maybe only a few pixels wide. Of course it will not involve looping over all sample data as that will just take way to much overhead, that's okay because I just want an representation. Still this brings up the question as to how to go about making a method that involves creating just one sample from a massive collection of other samples? That is indeed a good question with no true, absolute answer it would seem.

As far as this video project collection is concerned I think I will just be going with sudo-random selection of a single sample, from the total sum of samples for a given point in the display. This is a flawed way of doing it, but nothing will be perfect with this of course. One nice thing about it though is that this way of doing it will prove to be very efficient to say the least as I am just grabbing a random sample from a total for a pixel. There might be better ways of doing this that might prove to be a little more accurate, but I do  not care to sink to much time into this one, at least at this time

This stack overflow post brings up a lot of good points to keep in mind if I aim to revisit this at some point.

https://stackoverflow.com/questions/11677246/drawing-zoomable-audio-waveform-timeline-in-javascript

### Video files working on top of the tools

On top of making the basic tools I will also want to make a number of video files in which I am testing out the tools. These will include videos in which I am just testing out a kind of waveform such as sine wave, or a kind of use case on top of everything such as a kind of timeline system that can be used to create music.

### Video01-xx-waveform-\*

I have to start somewhere and with that said there is just working out some code for various wave forms. There are the usual waveforms like sin, triangle, and pulse, and then there are the not so usual suspects with this as well. So with that I have waveform tools like table that is a way to create a waveform of waveforms, and then there is also an array waveform that allows for me to create a waveform with an array of amplitude data.

### Video02-xx-tune-\*

As the name suggessts this set of videos has to do with cretaing basic tunes with code. I have worked out som starting systems for that that I am testing out with these.

### Video03-xx-harmonics-\*

I started this collection as a way to at least start exploring some things that have to do with Harmonics and Standing waves. This is just one of the many little detials that seems to pop up when starting to get into this sort of thing.

https://www.youtube.com/watch?v=0Rfushlee0U&pp=ygUJaGFybW9uaWNz

### Video04-xx-perframe-\*

Again at this time the goal here is to explore all sorts of ways to create sample data, such as by way of a frame by frame basis. What I mean by that is if we are taking about 30 FPS video and say a 44.1 kHz 16 bit sample rate then that should be 1470 samples per second \( or 2940 bytes per second if we are dealing with mono 16bit sample depth \). So then one way to work out the alpha \( 0 - 1 \) values to go by is to do so on a frame by frame basis. That is then what this set of videos is about then.


## Audacity Sample Data and html sample data extorts

Audacity has an option to export sample data in an html format. I can then open up the javaScript console and use a litle javaScritp code to get a string value of sample data.

```js
[].map.call(document.querySelectorAll('tr'), (tr)=>{
    const a = ( parseFloat( tr.children[2].innerText ) + 1) / 2;
    return parseFloat( a.toFixed(2) )
}).slice(1, 1000).join(', ');
```

If We are just talking around 100 samples or so it will not take to long to do a little editing and then end up with a nice neat little array like this.

```
const data = [
  0.48, 0.59, 0.37, 0.57, 0.46, 0.59, 0.51, 0.46, 0.55, 0.47,
  0.52, 0.50, 0.46, 0.59, 0.36, 0.53, 0.63, 0.34, 0.56, 0.48,
  0.49, 0.65, 0.27, 0.52, 0.71, 0.38, 0.49, 0.48, 0.54, 0.60,
  0.30, 0.50, 0.72, 0.38, 0.47, 0.52, 0.52, 0.54, 0.42, 0.53,
  0.59, 0.38, 0.49, 0.62, 0.47, 0.47, 0.46, 0.50, 0.56, 0.53,
  0.49, 0.48, 0.46, 0.56, 0.53, 0.46, 0.52, 0.48, 0.46, 0.61,
  0.39, 0.64, 0.30, 0.63, 0.43, 0.59, 0.48, 0.35, 0.73, 0.24,
  0.86, 0.11, 0.81, 0.25, 0.69, 0.42, 0.42, 0.69, 0.22, 0.88,
  0.12, 0.78, 0.31, 0.61, 0.50, 0.39, 0.65, 0.34, 0.67, 0.37,
  0.57, 0.44, 0.53, 0.50, 0.47, 0.52, 0.49, 0.51, 0.49, 0.52
];
```

This can then be used with the array waveform to get something interesting maybe?


## waveform functions, for_sampset functions, and wave alphas

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








