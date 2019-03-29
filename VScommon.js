const fontSizes = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", ]
const makeSpan = (text,colorClass) => `<span class="${colorClass}">${text}</span>`

// read/write bitmaps from a master array (which then becomes very fragile!!!)

const writeBM = (key) => 
    (mask) => key.reduce((a,e,i)=> mask.indexOf(e)>-1 ? a += 1 << i : a , 0)
const readBM = (key) => 
    (BM)   => key.reduce((a,e,i)=> BM & (1 << i) ? [...a,e] : a , [])

const fetchList = {
    master:[
        'autoplay',
        'currentTime',
        'duration',
        'ended',
        'id',
        'mode', // dummy
        'paused',
        'playbackRate',
        'preload',
        'readyState',
        'src',
        'volume',
    ],
    descr:[
        'start video immediately',
        'position of current frame in seconds',
        'total available seconds',
        'video has ended',
        'video id',
        `VideoScan operating mode (normal, ${makeSpan("NETFLIX","red")}, ${makeSpan("disabled","blue")})`,
        'video is paused',
        'speed of video playback',
        'video preload',
        'loading status',
        'video data url',
        'current audio volume'
    ],
    default: [
        'currentTime',
        'duration',
        'mode',
        'paused',
        'playbackRate',
        'readyState',
    ],
    encodeBM: writeBM(this.master),
    decodeBM: readBM(this.master),
}
const VSoptions = [
    {name:"selUISize",       origin:"large",},
    {name:"selHideStatus",   origin:false,     kind:'checked', convert:'Boolean',},
    {name:"selRefreshRate",  origin:333,},
    {name:"selHideLogo",     origin:false,     kind:'checked', convert:'Boolean',},
    {name:"multiCheckStatus", origin:fetchList.default},
]
