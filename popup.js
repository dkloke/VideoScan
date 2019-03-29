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
const help         = document.getElementById('help')

const listenerControls = [arrowUp, arrowLeft, arrowDown, arrowRight, spaceBar, resetTo1]
const resizeControls   = [...listenerControls, ...document.querySelectorAll('.shadow')]
const helpControls     = [help,helpDiv]

// consts and funcs
const state = {mode:'normal', running:true, errorCount:0}

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
    state.hiddenStatus=!state.hiddenStatus
    execVS()
    // state.hiddenStatus=statusDiv.classList.toggle('hidden')
}
const toggleHelp = () =>{
    actionDiv.classList.toggle('hidden')
    helpDiv.classList.toggle('hidden')
}
const setSpaceIcon = (playing = arePlaying()) => {
    const classList = getIcon(spaceBar).classList
    classList.remove("fa-stop")
    classList.toggle("fa-play",!playing)
    classList.toggle("fa-pause",playing)
}
const getProps = (obj,propList) =>{
    return propList.reduce((a,e)=>{a[e]=obj[e];return a},{})
}
const createStatus =  (vid,list) =>{
    if(state.hiddenStatus){
        return ''
        //list=['playbackRate']
    }
    const set = getProps(vid,list)
    if(set.hasOwnProperty('mode')) 
        set.mode=!state.running?makeSpan("disabled","blue"):state.netflix?makeSpan("NETFLIX","red"):'normal'
    if(set.readyState) 
        set.readyState=['no data','metadata','data','loading','loaded'][set.readyState]
    Object.keys(set).forEach(e=>{
        switch (typeof set[e]){
            case 'boolean':
                set[e]=['no','yes'][0+set[e]]
                break
            case 'number':
                set[e]=set[e].toFixed(3)
                break
            case 'undefined':
                set[e]='?'
                break
            case 'null':
                set[e]='-'
                break
            default:
        }
    })
    const result = Object.keys(set)
        .map(e => `${e}:<span style='float:right'><strong>${set[e]}</strong></span>`)
        .join('<br>')
    return  result
}

const DUMMY_ID = 'VIDEOSPEED_DUMMY'
const ABS_MAX_SPEED = 9
const ABS_MIN_SPEED = 0.1 //0.07
const fetchVideos = '[...document.querySelectorAll("video")].reduce((a,e)=>e.duration?(a.push(e),a):a,[])'

const initVS        = ({}={})                      => `${fetchVideos};`
const getStatusVS   = (list=fetchList.master)      => `${fetchVideos}.map(e=>{const {${list}}=e;return {${list}};});`

const skipVS        = ({value=0,targets=[0]}={})   => (value==0)
                    ?''
                    : state.netflix
                        ? (`document.querySelector('button[aria-label="Seek ${value>0?"Forward":"Back"}"]').click();`)
                        : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.currentTime += ${value}});`


const pauseVS       = ({targets=[0]}={})           => state.netflix
                            ? `document.querySelector('button[aria-label="Pause"]').click();`
                            : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{if(!e.paused){e.VS_PAUSED=true;e.pause()}});`
const unPauseVS     = ({}={})                      => `${fetchVideos}.filter(e=>e.VS_PAUSED).forEach(e=>{e.VS_PAUSED=false;e.play()});`
const playVS        = ({targets=[0]}={})           => state.netflix
                            ? `document.querySelector('button[aria-label="Play"]').click();`
                            : `${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.play()});`
const setRateVS     = ({value=1,targets=[0]}={})   => (value==0)?'':`${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{e.playbackRate = ${Math.min(ABS_MAX_SPEED,Math.max(ABS_MIN_SPEED,value))};});`
const adjustRateVS  = ({value=0.1,targets=[0]}={}) => (value==0)?'':`${fetchVideos}.filter(e=>Math.ceil(e.duration)).forEach(e=>{const n=(Math.trunc(e.playbackRate*100)+${Math.trunc(value*100)})/100;e.playbackRate=(n<${ABS_MIN_SPEED})?(e.pause(),e.VS_PAUSED=true,${ABS_MIN_SPEED}):n});`

const errorHandler = (error='(none)') => {
    if(++state.errorCount>2)
        state.running=false
    console.warn("(%i) %o",state.errorCount,error)
}

const updateStatus = (vid,selection) => {
    if (vid) {
        statusDiv.innerHTML = createStatus(vid,selection)
        currentSpeed.innerText = 'x'+(Math.round(vid.playbackRate*100)/100)
        resetTo1.classList.toggle('btn3disabled',vid.playbackRate===1)  
        // chrome.browserAction.setBadgeText({text: shortSpeed.toString()});
    } else {
        errorHandler(Error('Status update failed, object: "vid" was empty'))
        execVS(initVS)
    }
}


const execVS = async (cmd, options = {}, log=false) => {
    if(!state.running) return false
    let cmdStr = ''
    return chrome.tabs.executeScript({ code: (cmd ? cmdStr = cmd(options) : '')+getStatusVS() })
        .then(([result, ...rest]) => {
            if (log || (cmd && cmd.name === 'initVS'))
                console.log('%s %o %s :: %o', cmd ? cmd.name : '?', options, cmdStr, result)
            setSpaceIcon(arePlaying(result))
            if (statusDiv && statusDiv.style.display!=='none') {
                const vid = isActive(result) || isReady(result)
                updateStatus(vid,state.complete.multiCheckStatus)
            }
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
            execVS(adjustRateVS, { value: fraction })
            break
        case "arrowdown":
            execVS(adjustRateVS, { value: -fraction })
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
            toggleStatus()
            break
        case "f1":
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
                state.running=false
                statusDiv.innerHTML = 'Options page found.<br>No active video.'
            }
            state.netflix=(/netflix/.test(root))
        })
        .catch(errorHandler)

    return chrome.storage.sync.get(VSoptions.map(e=>e.name))
        .then(stored => {
            console.log('stored: %o',stored);
            state.complete = VSoptions.reduce((a,e)=>{a[e.name]=(stored.hasOwnProperty(e.name)?stored[e.name]:e.origin); return a},{})
            console.log('complete: %o',state.complete);
            resizeControls.forEach(e=>e.style.fontSize=state.complete.selUISize)
            statusDiv.style.fontSize = (9+fontSizes.indexOf(state.complete.selUISize))+'px'
            state.hiddenStatus =  state.complete.selHideStatus
            logo.classList.toggle('hidden',state.complete.selHideLogo)
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

    [...document.querySelectorAll('.toggleStatus')].forEach(e=>{
        e.addEventListener('dblclick', event => {
            statusDiv.classList.toggle('hidden')
        })
    })
    help.addEventListener('click',toggleHelp);
    helpDiv.addEventListener('click',toggleHelp);

    state.config = getConfig()
        .then(complete => {
            execVS()
            if(complete.selRefreshRate)
                setInterval(()=>{if(state.running)execVS()},complete.selRefreshRate)
            return complete
        })
        .catch(errorHandler)
}
