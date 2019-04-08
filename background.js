'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        css: ["video"]
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
let i=0
/*chrome.commands.onCommand.addListener(function(command) {
  if(command==="toggle-VideoScan"){
    // new chrome.declarativeContent.ShowPageAction()
      chrome.browserAction.setBadgeText({text: (i++).toString()});
  }
  console.log('Command:', command);
 // chrome.browserAction.setPopup("popup.html")
});*/
