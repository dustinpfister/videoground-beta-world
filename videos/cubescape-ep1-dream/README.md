# cubescape-ep1-dream video 

This is the first video of my 'cubescape' video idea making use of my cubeStackGrid module and guy one model to create a simple, short, skit like videos.


## Using espeak for voice

```
$ espeak -s 100 -p 20 "if this is a dream, that means I can fly if I want"
```

## Sequences

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

## working out the per values

```
var secsTotal = [3,2,2,5,2,3,3,10].reduce(function(acc, secs){ return acc + secs }, 0);
console.log(secsTotal);
// 30
```


```
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
