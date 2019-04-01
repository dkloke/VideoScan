// Copyright 2019 Dan Kloke. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// assumes/uses chrome-extension-async.js
// assumes/uses VScommon.js

// get elements
const logo         = document.getElementById('logo')
const actionDiv    = document.getElementById('actionDiv')
const currentSpeed = document.getElementById('currentSpeed')
const arrowUp      = document.getElementById('arrowUp')
const resetTo1     = document.getElementById('resetTo1')
const arrowLeft    = document.getElementById('arrowLeft')
const arrowDown    = document.getElementById('arrowDown')
const arrowRight   = document.getElementById('arrowRight')
const spaceBar     = document.getElementById('spaceBar')
const statusDiv    = document.getElementById('status')
const helpDiv      = document.getElementById('helpDiv')
const helpIcon     = document.getElementById('helpIcon')

const listenerControls = [arrowUp, arrowLeft, arrowDown, arrowRight, spaceBar, resetTo1]
const resizeControls   = [...document.querySelectorAll('#logo, #actionDiv')]
const helpControls     = [helpIcon,helpDiv]

// consts and funcs
const state = {mode:'normal', errorCount:0}

const modes= {
    normal:'normal',
    netflix: makeSpan("NETFLIX","red"),
    disabled: makeSpan("disabled","blue"),
}
const errorHandler = (error=Error('(none)')) => {
    if(++state.errorCount<3){
        state.mode=modes.disabled
    }
    console.warn("(%o) %o",state.errorCount,error)
}

const arePlaying = (arrVS) => Array.isArray(arrVS) 
    ? arrVS.filter(e => !e.paused).length 
    : 0
const isReady    = (arrVS) => Array.isArray(arrVS) 
    ? arrVS.filter(e => Math.ceil(e.duration)).pop()       
    : null
const isActive   = (arrVS) => Array.isArray(arrVS) 
    ? arrVS.filter(e => e.currentTime).pop()               
    : null
const rxIsDigit  = /^[1-9]$/
const getIcon= (element) => element.children[0]

const toggleStatus = () =>{
        statusDiv.classList.toggle('hidden')
}
const toggleHelp = () =>{
    actionDiv.classList.toggle('hidden')
    helpDiv.classList.toggle('hidden')
}
const toggleDarkMode = () => {
    const self = toggleDarkMode
    if(!self.body){
        [self.body]=document.getElementsByTagName('body')
    }
    self.body.classList.toggle('darkMode')
}
const syncSpaceIcon = (playing = arePlaying()) => {
    const classList = getIcon(spaceBar).classList
    classList.remove("fa-stop")
    classList.toggle("fa-play",!playing)
    classList.toggle("fa-pause",playing)
}
const getProps = (obj,propList) =>{
    return propList.reduce((a,e)=>{a[e]=obj[e];return a},{})
}

const formatVid = (set) => {    
    if(set.hasOwnProperty('mode')) 
        set.mode=state.mode
    if(set.hasOwnProperty('readyState')) 
        set.readyState=['no data (0)','metadata (1)','data (2)','loading (3)','loaded (4)',][set.readyState]
    return Object.keys(set).reduce((a,e)=>{
        switch (typeof set[e]){
            case 'boolean': a[e]=['no','yes'][0+set[e]]
                break
            case 'number': a[e]=set[e].toFixed(3)
                break
            case 'undefined': a[e]='?'
                break
            case 'null': a[e]='-'
                break
            default: a[e]=set[e].toString()
        }
        return a
    },{})
}


const idPrefix = 'VS_'
const idQuery = ()=>`span[id^="${idPrefix}"]`
const createStatus =  (formatted,target) =>{
    while(target.firstChild && target.removeChild(target.firstChild));
    const result = Object.keys(formatted)
        .forEach(name => {
            let p=document.createElement('p'),
                s=document.createElement('span')
            p.innerText=name
            s.innerText=formatted[name]
            s.id=idPrefix+name
            p.appendChild(s)
            target.appendChild(p)
        })
}

const updateStatus = (vid={playbackRate:1},selection) => {
    if (vid) {
        const rate = (Math.round(vid.playbackRate*100)/100)
        currentSpeed.innerText =isNaN(rate)?'x?':'x'+rate
        resetTo1.classList.toggle('btn2disabled',vid.playbackRate===1)  
        const formatted = formatVid(getProps(vid,selection))
        if( !document.querySelectorAll(idQuery()).length ){
            createStatus(formatted,statusDiv)
        }
        Object.keys(formatted).forEach(k=>{
            const e=document.querySelector('#'+idPrefix+k)
            if(e && e.innerHTML!=formatted[k])
                e.innerHTML=formatted[k]
        })
    } else {
        errorHandler(Error('Status update failed, object: "vid" was empty'))
        // take the remedy of the worst recoverable case: reset
        execVS(initVS)
    }
}

const DUMMY_ID = 'VIDEOSPEED_DUMMY'
const ABS_MAX_SPEED = 9
const ABS_MIN_SPEED = 0.1 //0.07

// commands for execVS
const fetchVideos = '[...document.querySelectorAll("video")].reduce((a,e)=>e.duration?(a.push(e),a):a,[])'
const initVS        = ({}={})                      => `${fetchVideos};`
const getStatusVS   = (list=fetchList.list)        => `${fetchVideos}.map(e=>{const {${list}}=e;return {${list}};});`

const skipVS        = ({value=0,targets=[0]}={})   => (value==0)
                        ?''
                        : state.mode===modes.netflix
                            ? (`document.querySelector('button[aria-label="Seek ${value>0?"Forward":"Back"}"]').click();`)
                            : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.currentTime += ${value}});`
const pauseVS       = ({targets=[0]}={})           => state.mode===modes.netflix
                            ? `document.querySelector('button[aria-label="Pause"]').click();`
                            : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{if(!e.paused){e.VS_PAUSED=true;e.pause()}});`
const unPauseVS     = ({}={})                      => `${fetchVideos}.filter(e=>e.VS_PAUSED).forEach(e=>{e.VS_PAUSED=false;e.play()});`
const playVS        = ({targets=[0]}={})           => state.mode===modes.netflix
                            ? `document.querySelector('button[aria-label="Play"]').click();`
                            : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.play()});`
const setRateVS     = ({value=1,targets=[0]}={})   => (value==0)
                                                        ? ''
                                                        : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.playbackRate = ${Math.min(ABS_MAX_SPEED,Math.max(ABS_MIN_SPEED,value))};});`
const adjustRateVS  = ({value=0.1,targets=[0]}={}) => (value==0)
                                                        ? ''
                                                        : `${fetchVideos}
                                                        .filter(e=>Math.ceil(e.duration))
                                                        .forEach(e=>{
                                                            const n=((0|e.playbackRate*100)+${(value*100)|0})/100;
                                                            e.playbackRate=(n<${ABS_MIN_SPEED})
                                                                ?(e.pause(),e.VS_PAUSED=true,${ABS_MIN_SPEED})
                                                                :n});`


const adjustVolVS  = ({value=0.1,targets=[0]}={}) => (value==0)
                                                        ? ''
                                                        : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.volume=Math.min(1,Math.max(0,((0|e.volume*100)+${0|value*100})/100));});`

// takes a function with separate params, this lets us see/report the function's name
// fetches video list/status EVERY TIME to get our end-state confirmation, so we sync with it.
const execVS = async (cmd, options = {}, log=false) => {
    if(state.mode===modes.disabled){
        updateStatus({mode:2,playbackRate:0},['mode'])
        return false  
    } 
    let cmdStr = ''
    return chrome.tabs.executeScript({ code: (cmd ? cmdStr = cmd(options) : '')+getStatusVS() })
        .then(([result, ...rest]) => {
            if (log || (cmd && cmd.name === 'initVS'))
                console.log('%s %o %s :: %o', cmd ? cmd.name : '?', options, cmdStr, result)
            syncSpaceIcon(arePlaying(result))
            const vid = isActive(result) || isReady(result)
            updateStatus(vid,state.complete.optStatusItems)
            return result
        })
        .catch(errorHandler)
} 



// tea for "mother"
const processEvents = (cmd, data) => {
    const { code, key, altKey, ctrlKey, shiftKey } = data
    // define things rather than calculate them, especially for identity!
    const factor = ctrlKey ? 0.1 : 1
    const fraction = ctrlKey ? 0.01 : 0.1
    // console.log(cmd, data)
    switch (cmd.toLowerCase()) {
        case "space":
        case "spacebar":
        //take own displayed state, if it's wrong at this point the click is redundant, so be it
            const { classList } = getIcon(spaceBar)
            classList.toggle("fa-pause")
            if (classList.toggle("fa-play")) {
                execVS(pauseVS)
            } else {
                execVS(unPauseVS)
                execVS(playVS)
            }
            break
        case "arrowup":
            execVS(altKey?adjustVolVS:adjustRateVS, { value: fraction })
            break
        case "arrowdown":
            execVS(altKey?adjustVolVS:adjustRateVS, { value: -fraction })
            break
        case "arrowleft":
            execVS(skipVS, { value: -(altKey ? 60 : shiftKey ? 10 : factor) })
            break
        case "arrowright":
            execVS(skipVS, { value: altKey ? 60 : shiftKey ? 10 : factor })
            break
        case "keyn":
        case "keyr":
        case "resetto1":
            execVS(setRateVS, { value: 1 })
            if (ctrlKey)
                execVS(pauseVS)
            break
        case "keyd":
        case "keys":
            if(altKey) {
                toggleDarkMode()
                break
            }
            toggleStatus()
            break
        case "keyh":
            toggleHelp()
        break
        default:
            if (rxIsDigit.test(key)) {
                execVS(setRateVS, { value: k * factor })
            }
    }
    return false
}




// fetch settings, initialize
const getConfig = async () => {
    chrome.tabs.query({ active: true, currentWindow: true })
        .then(result=>{
            [state.activeTab]=result
            const root = state.activeTab.url.split('/')[2]
            if('jdkpkicnabpkbgpidgepdocnmjcnoagm'===root){
                state.mode=modes.disabled
                updateStatus({mode:2},['mode'])
                //statusDiv.innerHTML = 'Options page found.<br>No active video.'
            }
            if(/netflix/.test(root)){
                state.mode=modes.netflix
            }
        })
        .catch(errorHandler)

    return chrome.storage.sync.get(VSoptions.map(e=>e.name))
        .then(stored => {
            console.log('stored: %o',stored);
            state.complete = VSoptions.reduce((a,e)=>{a[e.name]=(stored.hasOwnProperty(e.name)?stored[e.name]:e.origin); return a},{})
            console.log('complete: %o',state.complete);
            resizeControls.forEach(e=>e.style.fontSize=state.complete.optUISize)
            statusDiv.style.fontSize = (9+fontSizes.indexOf(state.complete.optUISize))+'px'
            statusDiv.classList.toggle('hidden',state.complete.optHideStatus)
            logo.classList.toggle('hidden',state.complete.optHideLogo)
            if(state.complete.optDarkMode) 
                processEvents('keyd',{altKey:true})
            return state.complete
        })
        .catch(errorHandler)
}

const mouseEvent = event => {
    const id = event.target.id || event.target.parentNode.id
    processEvents(id,event)
}
const keyEvent = event => {
    const {code} = event
 //   console.log(code,event)
    flashButton(code)
    processEvents(code,event)
}
const flashButton = code => {
    let id = code.charAt(0).toLowerCase() + code.slice(1)
    if(['keyN','keyR'].indexOf(id)>-1) id = 'resetTo1'
    if(id==='space') id = 'spaceBar'
    if(window[id]){
        window[id].classList.toggle('btnFlash')
        setTimeout(()=>{window[id].classList.toggle('btnFlash')},65)
    }
}

// ==============
window.onload = ()=>{

    // add listeners
    listenerControls.forEach(e=>{e.addEventListener('click',mouseEvent)})
    document.addEventListener('keydown',keyEvent);

    [...document.querySelectorAll('.ctrlStatus')].forEach(e => {
            e.addEventListener('dblclick', toggleStatus)
    })
    helpIcon.addEventListener('click', toggleHelp);
    getConfig()
        .then((complete)=>{
            setInterval(() => { execVS() }, complete.optRefreshRate)
        })
        .catch(errorHandler)
}