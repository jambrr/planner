'use strict';
import * as chrono from 'chrono-node';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

function getSelectedText(info){
    console.log(info.selectionText);
    let data = chrono.parseDate(info.selectionText);
    console.log(data);

    if(data != null){
        chrome.tabs.create({url: "https://www.google.com"});
    }
}
chrome.contextMenus.create({
    id: "1",
    title: "test",
    contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    getSelectedText(info)
});

