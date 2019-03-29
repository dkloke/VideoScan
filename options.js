// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// assumes/uses chrome-extension-async.js
// assumes/uses VScommon.js

const errorHandler = error => {
    console.warn(error)
}
// factory
const genSaveEventValue = ({name, kind = "value", convert}) => (event) => {
    const o = {}
    const value = typeof event === 'object' 
        ? event.target[kind] 
        : event
    o[name] = !!convert 
        ? typeof convert === 'function'
            ? convert(value)
            : typeof window[convert] ==='function'
                ? window[convert](value) 
                : (()=>{throw `Unable to process convert = "${convert.toString()}"`})()
        : value
    chrome.storage.sync.set(o)
        .then(() => {
            console.log('%s saved: %o', name, value)
        })
        .catch(errorHandler)
}
const checkBoxElement = ([property, description, selected]) =>
`<label class="checkBox">${makeSpan(property,'itemTitle')}&emsp;${description}
    <input type="checkbox" id="${property}" value="${property}" ${selected?'checked':''} name="checks1[]">
    <span class="checkmark"></span>
</label>`

const multiCheckStatus = document.getElementById('multiCheckStatus')
const getCheckGroup = () => [...document.querySelectorAll('input[name="checks1[]"]')]
const getCheckGroupValues = () => getCheckGroup().reduce((a,e)=>e.checked?[...a,e.id]:a,[])
const multiHandler = event => {
    multiCheckStatus.value = getCheckGroupValues()
    const o = {multiCheckStatus:multiCheckStatus.value}
    return chrome.storage.sync.set(o)
        .then((result) => {
            console.log('%s saved: %o', 'multiCheckStatus', o.multiCheckStatus)
            console.log('result: ',result)
            return result
        })

}
// this getElementById fetch is kind of gratuitous, just good initialization.
let resetDefaults = document.getElementById('resetDefaults')
const resetDefaultsEvent =  event => {
    getCheckGroup().forEach(e=>{
        e.checked = fetchList.default.indexOf(e.id)>-1
    })
    multiHandler()
}
// create, init, and hook
const init = (options) => {
    options.forEach(e => {
        const elem = document.getElementById(e.name)
        let eventFunc
        chrome.storage.sync.get(e.name)
            .then(value => {
                if(e.name==='multiCheckStatus'){
                    const sel = value.hasOwnProperty(e.name) && Array.isArray(value[e.name])?value[e.name]:e.origin
                    const work = fetchList.master.map((e,i)=>([e,fetchList.descr[i],sel.indexOf(e)>-1]))
                    multiCheckStatus.innerHTML=work
                        .map(a=>checkBoxElement(a))
                        .join('\n')
                        + multiCheckStatus.innerHTML
                    getCheckGroup().forEach(e=>e.addEventListener('change', multiHandler))       
                    resetDefaults = document.getElementById('resetDefaults')
                    resetDefaults.addEventListener('click',resetDefaultsEvent)
                }else{
                    elem[e.kind||"value"] = value.hasOwnProperty(e.name)?value[e.name]:e.origin
                    elem.addEventListener('change', eventFunc=genSaveEventValue(e))
                }
            })
            .catch(errorHandler)
    })
}



init(VSoptions)


