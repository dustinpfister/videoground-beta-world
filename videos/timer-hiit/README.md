# timer-hiit

This is a timer video project where I would like to make timer videos that help with the process of [High-intensity interval training](https://en.wikipedia.org/wiki/High-intensity_interval_training).


## What is HIIT?

It is a kind of physical exercise training protocol that involves intervals consisting of short periods of intense anaerobic exercise, with brief recovery periods. These intervals begin after a warm up period, and after ending finish off with a cool down period. There is no set rules in terms of the number of intervals, the amount of time per interval, the ratio of time for high and now intensity exercise, or the amount of time for warm up and cool down periods.

```
From Wikipedia:

HIIT exercise sessions generally consist of a warm-up period followed by repetitions of high-intensity exercises separated by medium intensity exercises for recovery, then a cool-down period. 

There is no specific formula for HIIT. Depending on one's level of cardiovascular development, the moderate-level intensity can be as slow as walking. A common formula involves a 2:1 ratio of work to recovery periods, for example, 30–40 seconds of hard sprinting alternated with 15–20 seconds of jogging or walking, repeated to failure.
```

### Figuring out what the values should be for a work out video

The way that I have things worked out for say, a 5 minue video there are a lot of ways that I could break up a five minue workout video. For example I could do 4 48 second intervals with a 1:1 ratio for high and low intensity time with a 60 second warm up and a 42 second cool down. This would result in a 24 second high intensity part, and a 24 second low intesity part for each interval \( 1:1 \). However I can of course mix things up with a 5 minue workout and do 7 30 second intervals with a 2:3 ratio for high and low intensity with a 60 second warm up and a 30 second cool down. This then would result in 12 second high parts and 18 second low parts for each interval.

I have some javaScript functions worked out thus far when it comes to this of course.

```js
// get per interval secs
var getPerIntervalSecs = (min, sec, intervals, warmSecs, coolSecs) => {
    intervals = intervals === undefined ? 3 : intervals;
    warmSecs = warmSecs === undefined ? 3 : warmSecs;
    coolSecs = coolSecs === undefined ? 3 : coolSecs;
    var totalSecs = min * 60 + sec;
    var totalIntervalSecs = totalSecs - warmSecs - coolSecs;
    return totalIntervalSecs / intervals;
};
// get high low secs
var getHighLowSecs = (min, sec, intervals, warmSecs, coolSecs, ratio) => {
    ratio = ratio || [1,1];
    var perIntervalSecs = getPerIntervalSecs(min, sec, intervals, warmSecs, coolSecs);
    var sum = ratio[0] + ratio[1];
    return ratio.map( (n) => {
        return perIntervalSecs / sum * n;
    });
};

getPerIntervalSecs(5, 0, 4, 60, 48); // 48
getHighLowSecs(5, 0, 4, 60, 48, [1,1]); // [24, 24]

getPerIntervalSecs(5, 0, 7, 60, 30); // 30
getHighLowSecs(5, 0, 7, 60, 30, [2,3]); // [12, 18]
```