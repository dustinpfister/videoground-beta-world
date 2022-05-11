# VideoGround Beta world video files

I have made an electron.js powered program that I aim to use to make little video projects that for now I am just simply calling videoground. I am now thinking that I should start making at least some actual content with what I have togetaher rather than putting this off until a later revision is done with more features and a better refined system for how I go about defining the logic for a video. If I do put off making videos then I might just keep on working on the applaction rather than making content with it. If that happens then I might loose interst in working on it so I started this reposatory to store files and data that are for certian ideas for videos rather than the applaction.

This is then the collection of files to use with videoground to create frames that can then be used with a program like ffmpeg to create a final video file. Addtional tools like espeak, aduacity, musesocre and so forth can then be used to create auto tracks for a finished product as well.

# The general idea of 'Beta World'

The term Beta is a reference to Beta Software, so in other words the Beta World is a world that is feature compleate, but will contain a lot of problems, or for on reason or another does not feel like a finihsed product. The orgional idea for beta works was to make a sries of skit like videos where there are just two characters, 'guy1', and 'guy2' and a world of objects in which they can interact with. All of the various assets should be in place at least when I start the very first video, although much of the fine details of everything might only be refined as needed from one video project to the next. However I have found that idea was a little overambitious, and I am now thinking that I will be treating beta word as just a general collection of video content in which I am experamenting with a bunch of diferenat ideas in whcih the original idea is just one of.

# Working out times for sequences


```
    seq1 : 
        desc: Open With sky view
        secs: 3
        per: 0

    seq2 : 
        desc: Zoom into guy
        secs: 2
        per: 0.10

    seq3 : 
        desc: Camera moves
        secs: 2
        per: 0.1666

    seq4 : 
        desc: guy1 says "if this is a dream, that measn I can fly if I want"
        secs: 5

    seq5 : 
        desc: Guy puts up arms
        secs: 2

    seq6 : 
        desc: guy takes off
        secs: 3

    seq7 : 
        desc: guy rotates, camera moves to behind view
        secs: 3

    seq8 : 
        desc: guy1 flying, guy1 says "If this is not a dream, then I need to lay off the shrooms"
        secs: 10 
```



```js
var secsTotal = [3,2,2,5,2,3,3,10].reduce(function(acc, secs){ return acc + secs }, 0);
console.log(secsTotal);
// 30
```

```js
var array = [3,2,2,5,2,3,3,10];
var secsTotal = array.reduce(function(acc, secs){ return acc + secs }, 0);
var perValues = [];
var i = 0, len = array.length;
while(i < len){
    var per = perValues[i - 1];
    if( per === undefined ){
        perValues.push(0);
    }else{
        var perDelta = array[i - 1] / secsTotal;
        perValues.push( parseFloat( ( per + perDelta ).toFixed(4) ) );         
    }
    i += 1;
}
console.log(perValues);
[0, 0.1, 0.1667, 0.2334, 0.4001, 0.4668, 0.5668, 0.6668]
```
