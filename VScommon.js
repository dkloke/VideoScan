// isn't there somewhere I can load this from?
const fontSizes = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", ]
const makeSpan  = (text,colorClass) => `<span class="${colorClass}">${text}</span>`

// read/write bitmaps from a master array (which then becomes very fragile!!! so let's not do this. )
const writeBM = (key) => 
    (mask) => key.reduce((a,e,i)=> mask.indexOf(e)>-1 ? a += 1 << i : a , 0)
const readBM  = (key) => 
    (BM)   => key.reduce((a,e,i)=> BM & (1 << i) ? [...a,e] : a , [])

const fetchList = {
    // properties to map off of the DOM <video> tag
    // name,description,default
    master:[
        ['autoplay'     , 'video starts immediately'             , false],
        ['currentTime'  , 'position of current frame in seconds' , true],
        ['duration'     , 'total available seconds'              , true],
        ['ended'        , 'video has ended'                      , false],
        ['id'           , 'video Id'                             , false],
        ['mode'         , `VideoScan operating mode (normal, ${makeSpan("NETFLIX","red")}, ${makeSpan("disabled","blue")})`, true],
        ['paused'       , 'video is paused'                      , true],
        ['playbackRate' , 'speed of video playback'              , true],
        ['preload'      , 'video preload'                        , false],
        ['readyState'   , 'loading status'                       , true],
        ['src'          , 'video data url'                       , false],
        ['volume'       , 'current audio volume'                 , false],
    ],
    get list () {return this.master.map(e=>e[0])},
    get description () {return this.master.map(e=>e[1])},
    get initialDefault () {return this.master.reduce((a,e)=>e[2]?[...a,e[0]]:a,[])},
    // encodeBM: writeBM(this.master.map(e=>e[0])),
    // decodeBM: readBM(this.master.map(e=>e[0])),
}

const VSoptions = [
    {name:"optUISize",        origin:"large",},
    {name:"optHideStatus",    origin:false,     kind:'checked', convert:'Boolean',},
    {name:"optRefreshRate",   origin:333,},
    {name:"optHideLogo",      origin:false,     kind:'checked', convert:'Boolean',},
    {name:"optStatusItems",   origin:fetchList.initialDefault},
    {name:"optDarkMode",      origin:false,     kind:'checked', convert:'Boolean',},
]
