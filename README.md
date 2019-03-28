# ![alt text](images/videoscan128.png "VideoScan") VideoScan

by Dan Kloke &copy;2019 - Licenses: <a href="https://github.com/muaz-khan/Chrome-Extensions/blob/master/LICENSE" target="_blank" rel="nofollow">MIT / Google</a> - <a href="https://github.com/dkloke/VideoScan/settings" target="_blank" rel="nofollow">open source</a>

from a tweet by [@kentcdodds](https://twitter.com/kentcdodds/status/1069637300458586115)
#
Use keboard or mouse/touch to adjust video playback rate.

Key|Action|Regular|Control|Shift
---|---|:-:|:-:|:-:|
&uarr;&nbsp;Up&nbsp;arrow|Faster&nbsp;playrate|+0.1|+0.01|
&darr;&nbsp;Down&nbsp;arrow|Slower&nbsp;playrate|-0.1|-0.01|
&larr;&nbsp;Left&nbsp;arrow|Skip&nbsp;Back|-1s|-10s|-1m
&rarr;&nbsp;Right&nbsp;arrow|Skip&nbsp;Forward|+1s|+10s|+1m
Space&nbsp;bar|Pause|
1 2 3 4 5 6 7 8 9|Playback&nbsp;speed|x1&nbsp;-&nbsp;x9|x0.1&nbsp;-&nbsp;x0.9
R,&nbsp;N|Reset&nbsp;to&nbsp;Normal|x1|x1&nbsp;+&nbsp;Pause
#
VideoScan issues commands to the &lt;`video`&gt; element as you type or click/tap while the popup is active and has focus. The responsiveness of the page's video player depends on hardware performance, network bandwidth, and on-page application code.

Repeated speed adjustments can cause video players to lose audio synchronization. To recover audio sync, try skipping forward/back or adjusting the video's replay position, stop and restart the player, or reload the page.

The app does not send any information to the developer, and only stores user preferences locally. This app acts on the DOM &lt;`video`&gt; objects, it does not change any video or audio data, only the position and speed of replay. VideoScan currently makes no effort to be compatible with custom page code or other browser apps.

## Credits
[FontAwesome Free Fonts](https://fontawesome.com/)

[Axialis IconGenerator Free Edition](https://www.axialis.com/icongenerator/)
![alt text](images/videoscan128.png "VideoScan")#VideoScan
by Dan Kloke &copy;2019 - Licenses: <a href="https://github.com/muaz-khan/Chrome-Extensions/blob/master/LICENSE" target="_blank" rel="nofollow">MIT / Google</a> <a href="https://github.com/dkloke/VideoScan/settings" target="_blank" rel="nofollow">github</a>
from a tweet by [@kentcdodds](https://twitter.com/kentcdodds/status/1069637300458586115)
---
This extension looks for *all* &lt;`video`&gt; elements on the page, and adjusts their playback speed (`.playbackRate</span>) simultaneously for all tags on the page. "Works on everything" as far as I know.

Adjust video playback rate using <span class="keys">&uarr;</span>/<span class="keys">&darr;</span> cursor keys, a mouse/touch interface, or manual entry.

Repeated speed adjustments can cause video players to lose audio synchronization. To recover audio sync, try skipping forward/back or adjusting the video's replay position, stop and restart the player, or reload the page.

The app does not send any information to the developer, and only stores user preferences locally. This app acts on the DOM `&lt;video&gt;` objects, it does not change any video or audio data, only the speed of replay. VideoScan currently makes no effort to be compatible with on-page code or other browser apps.

This tool can be used for pure amusement, but has serious utility as well. I use it to slow down guitar and kungfu videos to examine technique, and for research, speeding up to scan longer videos, slowing down to ~0.6 try to discern voices and other sounds/actions during confusing sections of a recording.
---
###Credits
[FontAwesome Free Fonts](https://fontawesome.com/)
[Axialis IconGenerator Free Edition](https://www.axialis.com/icongenerator/)


    <p>
        <img src="images/videoscan128.png"><h1>VideoScan</h1>
    </p>
    <p>
        by Dan Kloke &copy;2019 - Licenses: <a href="https://github.com/muaz-khan/Chrome-Extensions/blob/master/LICENSE" target="_blank" rel="nofollow">MIT / Google</a> <a href="https://github.com/dkloke/VideoScan/settings" target="_blank" rel="nofollow">github</a>
    </p>
    <p>from a tweet by <a href="https://twitter.com/kentcdodds/status/1069637300458586115" target="_blank" rel="nofollow"> @kentcdodds</a></p>

    <p>
        This extension looks for <strong>all</strong> <span class="hilite">&lt;video&gt;</span> elements on the page, and adjusts their playback speed (<span class="hilite">.playbackRate</span>) simultaneously for all tags on the page. "Works on everything" as far as I know.
        <br /><br />
        Adjust video playback rate using <span class="keys">&uarr;</span>/<span class="keys">&darr;</span> cursor keys, a mouse/touch interface, or manual entry.
        <br /><br />
        Repeated speed adjustments can cause video players to lose audio synchronization. To recover audio sync, try skipping forward/back or adjusting the video's replay position, stop and restart the player, or reload the page.
        <br /><br />
        The app does not send any information to the developer, and only stores user preferences locally. This app acts on the DOM <span class="hilite">&lt;video&gt;</span> object, it does not change any data, only the speed of replay. VideoScan currently makes no effort to be compatible with on-page code or other browser apps.
    </p>
    <p>
        This tool can be used for pure amusement, but has serious utility as well. I use it to slow down guitar and kungfu videos to examine technique, and for research, speeding up to scan longer videos, slowing down to ~0.6 try to discern voices and other sounds/actions during confusing sections of a recording.
    </p>
    <p>
        
    </p>

