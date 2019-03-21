# ![alt text](images/videoscan128.png "VideoScan") VideoScan

by Dan Kloke &copy;2019 - Licenses: <a href="https://github.com/muaz-khan/Chrome-Extensions/blob/master/LICENSE" target="_blank" rel="nofollow">MIT / Google</a> - <a href="https://github.com/dkloke/VideoScan/settings" target="_blank" rel="nofollow">open source</a>

from a tweet by [@kentcdodds](https://twitter.com/kentcdodds/status/1069637300458586115)
#
Use keboard or mouse/touch to adjust video playback rate.

Key|Action|Value|Control|Shift
---|---|:-:|:-:|:-:|
&uarr; Up arrow|Faster playrate|+0.1||
&darr; Down arrow|Slower playrate|-0.1||
&larr; Left arrow|Skip Back|-1s|-10s|-1m
&rarr; Right arrow|Skip Forward|+1s|+10s|+1m
Space bar|Pause|
1-9 Numbers|Playback speed|x&lt;#&gt;|x0.&lt;#&gt;
ctrl-R, ctrl-N|Reset to Normal|x1
#
VideoScan issues commands to the `video` element as you type or click/tap while the popup is active and has focus. The responsiveness of the page's `video` player depends on hardware performance, network bandwidth, and on-page application code.

Repeated speed adjustments can cause video players to lose audio synchronization. To recover audio sync, try skipping forward/back or adjusting the video's replay position, stop and restart the player, or reload the page.
