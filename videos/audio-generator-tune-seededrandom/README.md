# audo-generator-tune-seededrandom

This is the first collection of videos that I have started based on what I started with in audio-generator-1. The goal with audio-generator-1 was to just get some basic tools worked out for creating audio sample data by way of some javaScript code. Now that this goal has been achieved there is now the question of where I go from there. With that said with this project I would just like to work out some tunes centered around the use of the seededrandom waveform that I made in audio-generator-1 as I think that waveform as an interesting gritty kind of sound to it that deserves at least a few videos, say about 10 or so in which I play around with some more examples of it.

While I am at it I would also like to try out youtube short format videos, and also refine the seedednoise waveform with at least a few features that might add to the value of it.

## Goals for this project

* () start with code from audio-generator-1 hacking over things as needed
* () Add new backed in waveforms to the copy of samp\_create.js for this project
* () Make youtube shorts format videos for this project.
* () At least 10 videos using the 'seedednoise' or a new updated form of this waveform

## A Word on THREE.MathUtils.seededRandom

If you are not familiar with the seededRandom method of the math utils object of the three.js javaScript library there is [checking out the docs](https://threejs.org/docs/#api/en/math/MathUtils.seededRandom) and [source code with this one](https://github.com/mrdoob/three.js/blob/r156/src/math/MathUtils.js) as always. However What I will say about it here to save you a click is that it is a method that will return a "Deterministic pseudo-random float" as said in the Docs. Maybe another way to describe it is that it like the Math.random method baked into core javaScript itself, but it has a Deterministic rather than Stochastic nature to it.

The seeded random method can take an integer value as the first argument, and the same value will be returned for the same seed value. When I give say a harmonic index, rather than a sample index value for each call, this will result in the same sample values per wave cycle. I can then adjust frequency as well as the number of harmonics to get all kinds of interesting sounds with this. So it is called for then to work out at least a few videos with this one then, thus here we are.