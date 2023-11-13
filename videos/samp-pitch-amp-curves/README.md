# samp-pitch-curves

This is a few videos in which I am playing around with the use of curves to adjust pitch, and amplitude over time when generating sound. While I am at it I can also look into using curves as a way to adjust various other aspects of sound syntheses such as the parameters of a given waveform function such as the _values per wave_ option of the _seeded noise_ waveform. Also this is the first beta word project in which I am using R0 of the samp\_create.js file found in the root js folder rather than making copies of the same file over and over again for each project folder. Doing so might have been called for when I was first starting out with this, but now that I know a thing or two about generating sample data it is time to start an actual module and test it, and use that same module from one project to the next.

So then the bullet points with this are

* (done) Use curves as a way to set pitch, amplitude
* (done) Use curves to set the values of a waveform option like values\_per\_wave of seedednoise over time
* (done) see about using curve paths composed of two or more cubic bezier curves
* test out and finish R0 at least of samp\_create module in the root js folder

