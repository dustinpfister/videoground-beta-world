# audo-generator-waveform

Now that the audo-generator-1 project is more or less done, I should now start to work on more projects in which I continue to build on what I have done thus far. I have a lot of ideas for what this might mean, but as far as this project is concerned the focus will be on waveforms. When I first starting out with writing my own software for creating audio sample data there is starting out with just a simple sine wave, but even with that there are a lot of ways to create even that kind of waveform. When doing so should I do a full waveform for a frequency of 1, or a half wave? Should the amplitude for the wave start a zero and then go to 1 if it is a half wave or should it go from -1 to 1 if the amplitude value is 1? Concerns like this only go up as I start to get into more complex methods of creating waveforms so I started this collection of content in an effort to work some of this stuff out for myself.

## video01-xx-array-* - Array Waveform

I am thinking that this whole collection of content might involve the use of the 'array' waveform as I am calling it. The display of all the videos will then show the state of the sound as a whole, the state of the current frame as usual, however they will also show the state of the waveform that is being used. I will then want to make this waveform display the largest display at the bottom of these videos that will always show the current state of the waveform, while the frame by frame display will show the current state of frequency of the current waveform state.

<div align="center">
    <a href="https://www.youtube.com/watch?v=hEz_AvlWBbc">
        <img src="https://img.youtube.com/vi/hEz_AvlWBbc/0.jpg" style="width:50%;">
    </a><br>
    <p>
        video01-02-array-switch
    </p>
</div>

So then the first few videos of this collection might be to just work out some basic things branching off from the use of the array waveform. This collection will then also set the tone for all the other videos in this whole project folder.




## video02-xx-lerp-* - Lerp from one to another

A bunch of videos in which I am exploring the subject of transitioning from one kind of waveform to another using the lerp method of the math utils object of threejs. Simply put this is a method where I can pass a start value, end value, and then an alpha value \( 0-1 \) that will be used to get a value between the start and end value. The lerp method is then just a simply linear way of doing this kind of thing.


<div align="center">
    <a href="https://www.youtube.com/watch?v=O_wmxuYHIzc">
        <img src="https://img.youtube.com/vi/O_wmxuYHIzc/0.jpg" style="width:50%;">
    </a><br>
    <p>
        video02-03-lerp-pulse-to-seedednoise
    </p>
</div>


## video03-xx-import-* - Import sample data as wavefrom

With this set of videos I am exploring the topic of setting, updating, and transitioning a waveform by way of importing sample data. Thus far there are two general ways of doing this, one of which is to import data by way of a text JSON text from that I have started, and the other is by just directly reading a wav file that I want to use to do so.

<div align="center">
    <a href="https://www.youtube.com/watch?v=CcDDqAZUh-Y">
        <img src="https://img.youtube.com/vi/CcDDqAZUh-Y/0.jpg" style="width:50%;">
    </a><br>
    <p>
        video03-04-import-b17
    </p>
</div>


## video04-xx-curves-* - Using curves to create waveforms

I wanted to try out a few videos where I am using curves to create an update a waveform

<div align="center">
    <a href="https://www.youtube.com/watch?v=4acSWYdaMaM">
        <img src="https://img.youtube.com/vi/4acSWYdaMaM/0.jpg" style="width:50%;">
    </a><br>
    <p>
        video04-01-curves-cubicsin
    </p>
</div>

## video05-xx-sawtooth-* - Working out some sawtooth like waveforms

Trying to work out a number of ways to go about having sawtooth and sawtooth like waveforms.

<div align="center">
    <a href="https://www.youtube.com/watch?v=eJ6UlhuDoEM">
        <img src="https://img.youtube.com/vi/eJ6UlhuDoEM/0.jpg" style="width:50%;">
    </a><br>
    <p>
        video05-02-sawtooth-alt-offset
    </p>
</div>

