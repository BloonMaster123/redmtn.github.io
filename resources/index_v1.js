var year, month, day, weekDay, eventWeekDay, eventWeekDayString, eventHours, eventMinutes, eventMonth, eventDay, eventYear, eventDate, eventName, eventSuffix, visits, plannerData, plannerHour;
var debug = false;
var useHMS = false;
var version = "2.6.0";
var displayTimeInTab = false;
var enableNotes = false;
var pause = false;
var notes = [];
var dropdownHTML = "";

if(localStorage.getItem("visits")) {
	visits = parseInt(localStorage.getItem("visits")) + 1;
} else {
	visits = 0;
}

try {
	plannerData = JSON.parse(localStorage.getItem("plannerData"));
} catch {
	plannerData = {
		"_0": [],
		"_1": [],
		"_2": [],
		"_3": [],
		"_4": [],
		"_5": [],
		"_6": []
	};
}

localStorage.setItem("visits", visits);

function updatePlanner() {
	var aHourEnabled = 1;
	if(localStorage.getItem("AHour") === "false" && plannerHour === 0) {
		plannerHour++;
		aHourEnabled = 0;
	}
	if(weekDay !== 0 && weekDay !== 6) {
		eval("plannerData._" + plannerHour + "[" + (weekDay) + "] = document.getElementById(\"plannerInput\").value");
	} else {
		document.getElementById("plannerInput").value = "";
	}
	localStorage.setItem("plannerData", JSON.stringify(plannerData));
}

function enablePlanner(state) {
	if(state === true) {
		localStorage.setItem("enablePlanner", "true");
		document.body.insertAdjacentHTML('beforeend', '<div id="plannerContainer" style="width:500px;background-color:#fff;position: absolute;z-index: 9;"><div id="plannerContainerHeader" style="cursor: move;z-index: 10;text-align: center">Planner (Click to drag)</div><div><span style="margin-left:100px;">Today</span><span style="margin-left:200px;">Tomorrow</span></div><div id="plannerContent" style="width:250px;height:200px;"></div><textarea style="position: absolute;  resize: none; border:none;border-left:1px solid black;width:250px;height:200px;top: 45px; right: 0px" id="plannerInput" onkeyup="updatePlanner()"></textarea></div>');
		dragElement(document.getElementById("plannerContainer"));
	} else {
		localStorage.setItem("enablePlanner", "false");
		if(document.getElementById("plannerContainer")) {
			document.getElementById("plannerContainer").parentNode.removeChild(document.getElementById("plannerContainer"));
		}
	}
}

function discordPrompt() {
	bootbox.confirm({
		message: "Do you use this site regularly, but there's that <b>ONE</b> feature you're just <i>dying</i> to have added? <a href='https://discord.gg/KVWjVjw' target='_blank'>Join our discord</a> to discuss it!<br/><br/>Would you like to join?",
		buttons: {
			confirm: {
				label: 'Yes',
			},
			cancel: {
				label: 'No',
			}
		},
		callback: function(result) {
			if(result === true) {
				window.open('https://discord.gg/KVWjVjw', '_blank');
			}
		}
	});
}


function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

function bindEvent(element, eventName, eventHandler) {
	if(element.addEventListener) {
		element.addEventListener(eventName, eventHandler, false);
	} else if(element.attachEvent) {
		element.attachEvent('on' + eventName, eventHandler);
	}
}

var iFramed = inIframe();

console.log(iFramed);

if(localStorage.getItem("enableNotes") === null) {
	enableNotes = false;
} else {
	enableNotes = localStorage.getItem("enableNotes");
	if(enableNotes === "true") {
		enableNotes = true;
	}
	if(enableNotes === "false") {
		enableNotes = false;
	}
}

if(localStorage.getItem("displayTimeInTab") === null) {
	displayTimeInTab = false;
} else {
	displayTimeInTab = localStorage.getItem("displayTimeInTab");
	if(displayTimeInTab === "true") {
		displayTimeInTab = true;
	}
	if(displayTimeInTab === "false") {
		displayTimeInTab = false;
	}
}
var enableAHour = true;
if(localStorage.getItem("AHour") === null) {
	enableAHour = true;
} else {
	enableAHour = localStorage.getItem("AHour");
	if(enableAHour === "true") {
		enableAHour = true;
	}
	if(enableAHour === "false") {
		enableAHour = false;
	}
}
var scheduleName;
if(localStorage.getItem("schedule") === null) {
	scheduleName = "regular";
} else {
	scheduleName = localStorage.getItem("schedule");
}
var schoolName;
if(localStorage.getItem("school") === null) {
	schoolName = "rmhs";
} else {
	schoolName = localStorage.getItem("school")
}

function replaceCSS() {
	console.log(localStorage.getItem("css"));
	if(localStorage.getItem("css") !== null) {
		if(document.getElementById("customStyle")) {
			document.getElementById("customStyle").parentNode.removeChild(document.getElementById("customStyle"));
		}
		console.log(encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("useHMS%3A%20true"));
		if(encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("useHMS%3A%20true") >= 0) {
			useHMS = true;
			console.log("always using HMS");
		}
		document.getElementById("mainStylesheet").insertAdjacentHTML("beforebegin", "<style id='customStyle'>" + decodeURIComponent(localStorage.getItem("css")) + "</style>");
		console.log("inserting new CSS");

		if(encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("override%3A%20true") >= 0) {
			document.getElementById("mainStylesheet").parentNode.removeChild(document.getElementById("mainStylesheet"));
			console.log("main CSS overridden");
		}
	}
}

function updateTime() {
	if(pause === false) {
		var date;
		if(debug === true) {
			date = calDate;
		} else {
			date = new Date();
		}
		year = date.getFullYear();
		month = date.getMonth();
		day = date.getDate();
		var hoursM = date.getHours();
		var hours = hoursM;
		var suffix = "AM";
		weekDay = date.getDay();
		var weekDayString = "Sunday";

		if(weekDay === 1) {
			weekDayString = "Monday";
		} else if(weekDay === 2) {
			weekDayString = "Tuesday";
		} else if(weekDay === 3) {
			weekDayString = "Wednesday";
		} else if(weekDay === 4) {
			weekDayString = "Thursday";
		} else if(weekDay === 5) {
			weekDayString = "Friday";
		} else if(weekDay === 6) {
			weekDayString = "Saturday";
		}
		if(hours > 12) {
			hours = hours - 12;
			suffix = "PM";
		} else if(hours === 0) {
			hours = 12;
			suffix = "PM";
		}
		var minutesStr = ('0' + date.getMinutes().toString()).slice(-2);
		var secondsStr = ('0' + date.getSeconds().toString()).slice(-2);

		calculate(date);
		eventSuffix = "AM";
		if(eventHours > 12) {
			eventHours = eventHours - 12;
			eventSuffix = "PM";
		} else if(eventHours === 0) {
			eventHours = 12;
			eventSuffix = "PM";
		}
		var eventMinutesStr = ('0' + eventMinutes.toString()).slice(-2);
		document.getElementById("time").innerHTML = "<br/>Current Time: " + hours + ":" + minutesStr + " " + suffix + " - " + weekDayString + ", " + (month + 1) + "/" + day + "/" + year + "<br/><br/>" + eventName + ": " + eventHours + ":" + eventMinutesStr + " " + eventSuffix + " - " + eventWeekDayString + ", " + (eventMonth + 1) + "/" + eventDay + "/" + eventYear;
	}
	if(localStorage.getItem("enablePlanner") === "true") {
		if(document.activeElement != document.getElementById("plannerInput")) {
			document.getElementById("plannerInput").value = eval("plannerData._" + plannerHour + "[" + (weekDay) + "]");
		}
		var aHourEnabled = 1;
		if(localStorage.getItem("AHour") === "false" && plannerHour === 0) {
			plannerHour++;
			aHourEnabled = 0;
		}
		if(weekDay !== 0 && weekDay !== 6) {
			document.getElementById("plannerContent").innerHTML = eval("plannerData._" + plannerHour + "[" + (weekDay - 1) + "]");
		} else if(weekDay === 0) {
			document.getElementById("plannerContent").innerHTML = eval("plannerData._" + aHourEnabled + "[" + 0 + "]");
		} else {
			document.getElementById("plannerContent").innerHTML = eval("plannerData._" + 6 + "[" + 4 + "]");
		}
	}
}


function calculate(date) {
	if(pause === false) {
		var foundNext = false;
		var schedule = jsonData[schoolName][scheduleName].default;
		for(var i = 0; i < jsonData[schoolName][scheduleName].specialDays.length; i++) {
			if(jsonData[schoolName][scheduleName].specialDays[i].type === "weekly") {
				if(weekDay === jsonData[schoolName][scheduleName].specialDays[i].value) {
					schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
				}
			} else if(jsonData[schoolName][scheduleName].specialDays[i].type === "single") {
				if(date.getDate() === jsonData[schoolName][scheduleName].specialDays[i].value[0] && date.getMonth() + 1 === jsonData[schoolName][scheduleName].specialDays[i].value[1]) {
					schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
				}
			} else if(jsonData[schoolName][scheduleName].specialDays[i].type === "range") {
				if(date.getDate() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][0] && date.getDate() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][0] && date.getMonth() + 1 >= jsonData[schoolName][scheduleName].specialDays[i].value[0][1] && date.getMonth() + 1 <= jsonData[schoolName][scheduleName].specialDays[i].value[1][1] && date.getFullYear() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][2] && date.getFullYear() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][2]) {
					schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
				}
			}
		}
		eventDate = new Date(year, month, day);
		for(var i = 0; i < schedule.length; i++) {
			if(enableAHour === false && schedule[i][4] !== "aS" && schedule[i][4] !== "aE") {
				eventDate.setHours(schedule[i][0]);
				eventDate.setMinutes(schedule[i][1]);
				eventDate.setSeconds(schedule[i][2]);
				plannerHour = schedule[i][5];
				if(isPast(eventDate, date) === false && eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
					eventName = schedule[i][3];
					document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
					if(displayTimeInTab === true) {
						document.title = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
					} else {
						document.title = "Countdown";
					}
					foundNext = true;
					i = schedule.length;
				}
			}
			if(enableAHour === true && schedule[i][4] !== "bell") {
				eventDate.setHours(schedule[i][0]);
				eventDate.setMinutes(schedule[i][1]);
				eventDate.setSeconds(schedule[i][2]);
				plannerHour = schedule[i][5];
				if(isPast(eventDate, date) === false && eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
					eventName = schedule[i][3];
					document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
					if(displayTimeInTab === true) {
						document.getElementById("pageTitle").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
					} else {
						document.getElementById("pageTitle").innerHTML = "Countdown";
					}
					foundNext = true;
					i = schedule.length;
				}
			}
		}
		var addNum = 1;
		while(foundNext === false && addNum < 365) {
			eventDate.setDate(eventDate.getDate() + 1);
			if(eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
				var schedule = jsonData[schoolName][scheduleName].default;
				for(var i = 0; i < jsonData[schoolName][scheduleName].specialDays.length; i++) {
					if(jsonData[schoolName][scheduleName].specialDays[i].type === "weekly") {
						if(eventDate.getDay() === jsonData[schoolName][scheduleName].specialDays[i].value) {
							schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
						}
					} else if(jsonData[schoolName][scheduleName].specialDays[i].type === "single") {
						if(eventDate.getDate() === jsonData[schoolName][scheduleName].specialDays[i].value[0] && eventDate.getMonth() + 1 === jsonData[schoolName][scheduleName].specialDays[i].value[1]) {
							schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
						}
					} else if(jsonData[schoolName][scheduleName].specialDays[i].type === "range") {
						if(eventDate.getDate() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][0] && eventDate.getDate() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][0] && eventDate.getMonth() + 1 >= jsonData[schoolName][scheduleName].specialDays[i].value[0][1] && eventDate.getMonth() + 1 <= jsonData[schoolName][scheduleName].specialDays[i].value[1][1] && eventDate.getFullYear() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][2] && eventDate.getFullYear() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][2]) {
							schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
						}
					}
				}
				for(var i = 0; i < schedule.length; i++) {
					if(enableAHour === false && schedule[i][4] !== "aS" && schedule[i][4] !== "aE") {
						eventDate.setHours(schedule[i][0]);
						eventDate.setMinutes(schedule[i][1]);
						eventDate.setSeconds(schedule[i][2]);
						if(isPast(eventDate, date) === false) {
							eventName = schedule[i][3];
							document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
							if(displayTimeInTab === true) {
								document.getElementById("pageTitle").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
							} else {
								document.getElementById("pageTitle").innerHTML = "Countdown";
							}
							foundNext = true;
							i = schedule.length;
						}
					}
					if(enableAHour === true && schedule[i][4] !== "bell") {
						eventDate.setHours(schedule[i][0]);
						eventDate.setMinutes(schedule[i][1]);
						eventDate.setSeconds(schedule[i][2]);
						if(isPast(eventDate, date) === false) {
							eventName = schedule[i][3];
							document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
							if(displayTimeInTab === true) {
								document.getElementById("pageTitle").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
							} else {
								document.getElementById("pageTitle").innerHTML = "Countdown";
							}
							foundNext = true;
							i = schedule.length;
						}
					}
				}
			}
		}


		eventWeekDay = eventDate.getDay();
		eventWeekDayString;
		if(eventWeekDay === 1) {
			eventWeekDayString = "Monday";
		} else if(eventWeekDay === 2) {
			eventWeekDayString = "Tuesday";
		} else if(eventWeekDay === 3) {
			eventWeekDayString = "Wednesday";
		} else if(eventWeekDay === 4) {
			eventWeekDayString = "Thursday";
		} else if(eventWeekDay === 5) {
			eventWeekDayString = "Friday";
		} else if(eventWeekDay === 6) {
			weekDayString = "Saturday";
		}
		eventHours = eventDate.getHours();
		eventMinutes = eventDate.getMinutes();
		eventMonth = eventDate.getMonth();
		eventDay = eventDate.getDate();
		eventYear = eventDate.getFullYear();

	}
}



function msToStr(s, f) {
	if(pause === false) {
		var fm = [Math.floor(s / 60 / 60 / 24), Math.floor(s / 60 / 60) % 24, Math.floor(s / 60) % 60, s % 60];
		if(window.innerWidth >= 875 && f === "full" && useHMS === false) {
			if(fm[0] !== 0) {
				return fm[0] + " Days, " + fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
			} else if(fm[1] !== 0) {
				return fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
			} else if(fm[2] !== 0) {
				return fm[2] + " Minutes and " + fm[3] + " Seconds";
			} else {
				return fm[3] + " Seconds";
			}
		} else {
			if(fm[0] !== 0) {
				return fm[0] + "D " + fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
			} else if(fm[1] !== 0) {
				return fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
			} else if(fm[2] !== 0) {
				return fm[2] + "M " + fm[3] + "S";
			} else {
				return fm[3] + "S";
			}
		}
	}
}

function resetCSS() {
	bootbox.confirm({
		message: "Are you sure you want to delete your custom stylesheet?",
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function(result) {
			if(result === true) {
				localStorage.removeItem("css");
				location.reload();
			} else {
				document.getElementById("settings").click();
			}
		}
	});
}

function handleFiles(files) {
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		var newCss;
		return function(e) {
			newCss = e.target.result;
			localStorage.setItem("css", encodeURIComponent(newCss));
			console.log("CSS written, replaced localstorage.");
			location.reload();
		};
	})(files[0]);
	reader.readAsText(files[0]);
}

function saveNotes() {
	console.log(document.getElementById("noteBox").value);
	localStorage.setItem("notes", JSON.stringify(notes));
}

function addNoteBox() {

}

function setNotes(state) {
	if(state === true) {
		console.log("enabling notes");
		enableNotes = true;
		if(localStorage.getItem("notes") !== null) {
			var notes = null;
			try {
				notes = JSON.parse(localStorage.getItem("notes"));
			} catch {
				console.log("Could not parse JSON");
				localStorage.removeItem("notes");
			}
		}
		document.body.insertAdjacentHTML("beforeend", '<div id="notesContainer" style="position: absolute;z-index: 9;;background-color:#fff"><div id="notesContainerHeader" style="cursor: move;z-index: 10;">Notes (Click to drag)</div><textarea style="resize: both;" onchange="saveNotes()" id="noteBox">notes</textarea></div>');
		dragElement(document.getElementById("notesContainer"));
	} else {
		if(document.getElementById("notesContainer")) {
			document.getElementById("notesContainer").parentNode.removeChild(document.getElementById("notesContainer"));
		}
	}
	localStorage.setItem("enableNotes", state);
}

function dragElement(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	if(document.getElementById(elmnt.id + "Header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}


function daysBetween(date1, date2) {
	var date1Ms = date1.getTime();
	var date2Ms = date2.getTime();
	var differenceMs = date2Ms - date1Ms;
	return Math.round(differenceMs / 1000);
}

function isPast(time, currentTime) {
	if(currentTime < time) {
		return false;
	} else {
		return true;
	}
}
var calDate = new Date();

function onLoad() {
	if(localStorage.getItem("enablePlanner") === "true") {
		enablePlanner(true);
	} else {
		localStorage.setItem("enablePlanner", "false")
	}
	if(visits === 4 || visits === 50 || visits === 150) {
		discordPrompt();
	}
	if(enableNotes === true) {
		setNotes(true);
	}
	if(iFramed === true) {
		if(document.getElementsByClassName("minimal").length > 0) {
			useHMS = true;
		}
		bindEvent(window, 'message', function(e) {
			if(e.data === "unload") {
				pause = true;
			} else {
				pause = false;
			}
		});
	}
	document.getElementById("settings").onclick = function(e) {
		e.preventDefault();
		if(iFramed === false) {
			if(schoolName === "mtnView" || schoolName === "westwood") {
				dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="A" onchange="updateSchedule(this.value)">Schedule A</option><option value="B" onchange="updateSchedule(this.value)">Schedule B</option></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input id="notes" type="checkbox" onchange="setNotes(this.checked)"/> Enable Notes (BETA)<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><input id="plannerCheckBox" type="checkbox" onchange="enablePlanner(this.checked)"/> Enable Planner<br/><br/>Upload custom stylesheet: <input type="file" name="datafile" accept=".css" onchange="handleFiles(this.files)"><input id="CSSReset" type="button" onclick="resetCSS()" value="Reset CSS"/><br/><br/><a href="./stylesheets">Browse Custom Stylesheets</a><br/><br/><a href="https://discord.gg/KVWjVjw" target="_blank">Join our Discord!!</a>');
				var boxHTML = $("#pageSettings")[0].children[0];
				boxHTML.children[7].value = "A"
			} else {
				dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="regular" onchange="updateSchedule(this.value)">Normal Schedule</option><option onchange="updateSchedule(this.value)" value="CORE">CORE Schedule</option>></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input id="notes" type="checkbox" onchange="setNotes(this.checked)"/> Enable Notes (BETA)<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><input id="plannerCheckBox" type="checkbox" onchange="enablePlanner(this.checked)"/> Enable Planner<br/><br/>Upload custom stylesheet: <input type="file" name="datafile" accept=".css" onchange="handleFiles(this.files)"><input id="CSSReset" type="button" onclick="resetCSS()" value="Reset CSS"/><br/><br/><a href="./stylesheets">Browse Custom Stylesheets</a><br/><br/><a href="https://discord.gg/KVWjVjw" target="_blank">Join our Discord!!</a>');
				var boxHTML = $("#pageSettings")[0].children[0];
				boxHTML.children[7].value = "default"
				document.getElementById("plannerCheckBox").checked = localStorage.getItem("enablePlanner") == 'true';
			}
		} else {
			if(schoolName === "mtnView" || schoolName === "westwood") {
				dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="A" onchange="updateSchedule(this.value)">Schedule A</option><option value="B" onchange="updateSchedule(this.value)">Schedule B</option></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input id="notes" type="checkbox" onchange="setNotes(this.checked)"/> Enable Notes (BETA)<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><input id="plannerCheckBox" type="checkbox" onchange="enablePlanner(this.checked)"/> Enable Planner<br/><br/><br/><a href="https://discord.gg/KVWjVjw">Join our Discord!!</a><br/><br/><a href="https://discord.gg/KVWjVjw" target="_blank">Join our Discord!!</a>');
				var boxHTML = $("#pageSettings")[0].children[0];
				boxHTML.children[7].value = "A"
			} else {
				dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="regular" onchange="updateSchedule(this.value)">Normal Schedule</option><option onchange="updateSchedule(this.value)" value="CORE">CORE Schedule</option>></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input id="notes" type="checkbox" onchange="setNotes(this.checked)"/> Enable Notes (BETA)<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><input id="plannerCheckBox" type="checkbox" onchange="enablePlanner(this.checked)"/> Enable Planner<br/><br/><br/><a href="https://discord.gg/KVWjVjw" target="_blank">Join our Discord!!</a>');
				var boxHTML = $("#pageSettings")[0].children[0];
				boxHTML.children[7].value = "default"
			}
		}
	}

	updateTime();
	setInterval(updateTime, 1000);
	if(window.location.hash === "#test" || window.location.hash === "#debug") {
		console.log("debug mode");
		debug = true;
		document.getElementById("countdown").insertAdjacentHTML('afterend', '<center><div class="datepicker-here" id="datepicker" data-language="en"></div><br/><h4>It looks like you found the Debug Page! If you would like to go back to the regular site, click <a href="' + window.location.origin + '">here</a>. If you are just woundering how this site works, feel free to look around!</h4></center>');
		$('#datepicker').datepicker({
			timepicker: true,
			onSelect: function(fd, d, picker) {
				if(!d) {
					return;
				} else {
					calDate = d;
				}
			}
		})
		$('#datepicker').data('datepicker')

	}
}

function updateDisplayTab(value) {
	displayTimeInTab = value;
	localStorage.setItem("displayTimeInTab", value);
}

function updateSchool(school) {
	var boxHTML = $("#pageSettings")[0].children[0];
	if(school === "mtnView" || school === "westwood") {
		boxHTML.children[4].innerHTML = '<option value="A" onchange="updateSchedule(this.value)">Schedule A</option><option value="B" onchange="updateSchedule(this.value)">Schedule B</option>';
		boxHTML.children[7].value = "A"
		scheduleName = "A";
		localStorage.setItem("schedule", "A");
	}
	if(school === "rmhs") {
		boxHTML.children[4].innerHTML = '<option value="regular" onchange="updateSchedule(this.value)">Normal Schedule</option><option onchange="updateSchedule(this.value)" value="CORE">CORE Schedule</option>';
		boxHTML.children[7].value = "default"
		scheduleName = "regular";
		localStorage.setItem("schedule", "regular");
	}
	schoolName = school;
	localStorage.setItem("school", school);
}

function updateSchedule(val) {
	scheduleName = val;
	localStorage.setItem("schedule", val);
}

function setAHour(val) {
	enableAHour = val;
	if(enableAHour === "true") {
		enableAHour = true;
	}
	if(enableAHour === "false") {
		enableAHour = false;
	}
	localStorage.setItem("AHour", enableAHour);
}

function dialogueBox(content) {
	var dialog = bootbox.dialog({
		message: "<div id='pageSettings'></div>",
		backdrop: true
	});
	$("#pageSettings").html(content);
	var boxHTML = $("#pageSettings")[0].children[0];
	document.getElementById("school").value = schoolName;
	document.getElementById("schedule").value = scheduleName;
	document.getElementById("AHour").checked = enableAHour;
	document.getElementById("displayTimeInTab").checked = displayTimeInTab;
	document.getElementById("notes").checked = enableNotes;
	if(iFramed === false) {
		document.getElementById("CSSReset").onclick = function() {
			dialog.modal('hide');
			resetCSS();
		}
	}
}


console.log("index.js loaded (version " + version + ")");