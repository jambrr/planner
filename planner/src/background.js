'use strict';
import * as chrono from 'chrono-node';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
function hasTime(date) {
    return date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;
}

function getSelectedText(info){
    let result = chrono.parse(info.selectionText);

    const startYear = result[0].start.get('year');
    const startMonth = String(result[0].start.get('month')).padStart(2, "0"); // 1-based month
    const startDay = String(result[0].start.get('day')).padStart(2, "0");
    const startHour = String(result[0].start.get('hour') || 0).padStart(2, "0"); // Default to 0 if undefined
    const startMinute = String(result[0].start.get('minute') || 0).padStart(2, "0");
    const endDate = result[0].end ? result[0].end.date(): null;
    const timezone = '';

    let startDateTime = `${startYear}${startMonth}${startDay}T${startHour}${startMinute}00${timezone}`;
    let endDateTime = `${startYear}${startMonth}${startDay}T${startHour}${startMinute}00${timezone}`;

    if(endDate != null){
        const endYear = result[0].end.get('year');
        const endMonth = String(result[0].end.get('month')).padStart(2, "0");
        const endDay = String(result[0].end.get('day')).padStart(2, "0");
        const endHour = String(result[0].end.get('hour') || 0).padStart(2, "0");
        const endMinute = String(result[0].end.get('minute') || 0).padStart(2, "0");

        endDateTime = `${endYear}${endMonth}${endDay}T${endHour}${endMinute}00${timezone}`;
    }

    // All day event
    if(endDate == null && startHour == '12'){
        startDateTime = `${startYear}${startMonth}${startDay}`;
        endDateTime = `${startYear}${startMonth}${startDay}`;
     }

    console.log(startDateTime);
    console.log(endDateTime);

    const title = "Event Title";

    if(result != null){
        const calendarUrl = `https://calendar.google.com/calendarrender?action=TEMPLATE&dates=${startDateTime}/${endDateTime}&text=${encodeURIComponent(title)}`;
        chrome.tabs.create({url: calendarUrl});
    }
}
chrome.contextMenus.create({
    id: "1",
    title: "Create an Event",
    contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    getSelectedText(info)
});

