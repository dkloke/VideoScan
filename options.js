// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// assumes/uses chrome-extension-async.js
// assumes/uses VScommon.js

const errorHandler = error => {
    console.warn(error)
}
const saveVal = async (name,value) => {
    let o = {}
    o[name]=value
    return chrome.storage.sync.set(o)
        .then((result)=>{
            console.log('Saved %s : %o : %o', name, value, result)
            return result
        })
    .catch(errorHandler)
}
// factory
const genSaveEventValue = ({name, kind = "value", convert}) => (event) => {
    const o = {}
    const value = typeof event === 'object' 
        ? event.target[kind] 
        : event
    const converted = !!convert 
        ? typeof convert === 'function'
            ? convert(value)
            : typeof window[convert] ==='function'
                ? window[convert](value) 
                : (()=>{throw `Unable to process convert = "${convert.toString()}"`})()
        : value
    saveVal(name,converted)
}
const checkBoxElement = ([property, description, selected],groupName='optSet1') => {
    const elem=document.createElement('label')
    elem.classList.add('checkBox')
    elem.innerHTML=`${makeSpan(property,'itemTitle')}&emsp;${description}
        <input type="checkbox" id="${property}" value="${property}" ${selected?'checked':''} name="${groupName}">
        <span class="checkmark"></span>`
    elem.querySelector('input').addEventListener('click', multiHandler)

    return elem
}
const optStatusItems = document.getElementById('optStatusItems')
const getCheckGroup = (groupName='optSet1') => [...document.querySelectorAll(`input[name="${groupName}"]`)]
const getCheckGroupValues = () => getCheckGroup().reduce((a,e)=>e.checked?[...a,e.id]:a,[])
// this is a small domain, so we'll just generate the result set every time something changes
const multiHandler = event => {
    optStatusItems.value = getCheckGroupValues()
    saveVal('optStatusItems',optStatusItems.value)
}

let resetDefaultChecks = document.getElementById('resetDefaultChecks')
const resetDefaultChecksEvent =  () => {
    getCheckGroup().forEach(o=>{
        o.checked = fetchList.initialDefault.indexOf(o.id)>-1
    })
    multiHandler()
}
resetDefaultChecks.addEventListener('click',resetDefaultChecksEvent)

const resetDefaults = document.getElementById('resetDefaults')
const resetDefaultsEvent =  () => {
    resetDefaultChecksEvent()
    VSoptions.forEach(obj=>{
        const elem = document.getElementById(obj.name)
        if(elem){
            elem[obj.kind||'value']=obj.origin
        }
        saveVal(obj.name,obj.origin)
    })
}
resetDefaults.addEventListener('click',resetDefaultsEvent)

// create, init, and hook
const init = (options) => {
    options.forEach(e => {
        const elem = document.getElementById(e.name)
        chrome.storage.sync.get(e.name)
            .then(value => {
                if(e.name==='optStatusItems'){
                    const selection = value.hasOwnProperty(e.name) && Array.isArray(value[e.name])
                        ? value[e.name]
                        : e.origin
                    fetchList.list
                        // build params for checkBoxElement
                        .map((e,i)=>([e,fetchList.description[i],selection.indexOf(e)>-1]))
                        // make rows of labels
                        .map(a=>checkBoxElement(a))
                        // flip em so we can push them in from the front
                        .reverse()
                        // push them in from the front
                        .forEach(e=>{
                            optStatusItems.prepend(e)
//                            e.querySelector('input').addEventListener('click', multiHandler)
                        })
                }else{
                    elem[e.kind||"value"] = value.hasOwnProperty(e.name)
                        ? value[e.name]
                        : e.origin
                    elem.addEventListener('change', genSaveEventValue(e))
                }
            })
            .catch(errorHandler)
    })
}

init(VSoptions)


