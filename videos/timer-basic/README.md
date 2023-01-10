# timer basic

This is my first timer video based off of template6 which is a start point for timer, or count down videos. For the most part this is the same as the template itself, but I made a few changes mainly with the alarm video.


<div align="center">
      <a href="https://www.youtube.com/watch?v=WGFIeh6sgCs">
         <img src="https://img.youtube.com/vi/WGFIeh6sgCs/0.jpg" style="width:50%;">
      </a>
</div>


## Single video file format

I started out this project in a way in which I would make three video files. One for the count down, another for an alarm, and yet another one for creating thumbnail images. However I have found that I now prefer to make single video files that can be used for both a count down, and alarm part, as well as be set into a THUM MODE by just changing a few constant values at the top of the file.

## More that one video to create and them concat using video1 files

Making one of these is a little different compared to others as I have more that one video java Script file for these kinds of projects. I create one for the count down, another for the alarm, and then yet another to create a bunch of images one of which I will use for the thumbnail image.

```
# ffmpeg -safe 0 -f concat -i videos.txt -c copy video.mp4
file 'video-cd.mp4'
file 'video-a.mp4'
```
