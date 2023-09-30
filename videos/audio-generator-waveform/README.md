# audo-generator-waveform

Now that the audo-generator-1 project is more or less done, I should now start to work on more projects in which I continue to build on what I have done thus far. I have a lot of ideas for what this might mean, but as far as this project is concerned the focus will be on waveforms. When I first starting out with writing my own software for creating audio sample data there is starting out with just a simple sine wave, but even with that there are a lot of ways to create even that kind of waveform. When doing so should I do a full waveform for a frequency of 1, or a half wave? Should the amplitude for the wave start a zero and then go to 1 if it is a half wave or should it go from -1 to 1 if the amplitude value is 1? Concerns like this only go up as I start to get into more complex methods of creating waveforms so I started this collection of content in an effort to work some of this stuff out for myself.

## video01-* - Array waveform 

I am thinking that this whole collection of videos might involve the use of the 'array' waveform as I am calling it. The display of all the videos will then display the state of the sound as a whole, the state of the current frame, and then also the state of the waveform that is being used. So then the first few videos of this collection might be to just work out some basic things branching off from the use of the array waveform.

## video02-* - Lerp from one to another

A bunch of videos in which I am exploring the subject of transitioning from one kind of waveform to another using the lerp method of the math utils object of threejs.