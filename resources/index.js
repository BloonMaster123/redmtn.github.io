var year, month, day, weekDay, eventWeekDay, eventWeekDayString, eventHours, eventMinutes, eventMonth, eventDay, eventYear, eventDate, eventName, eventSuffix;
var debug = false;
var useHMS = false;
var version = "2.6.0";
var displayTimeInTab = false;
if (localStorage.getItem("displayTimeInTab") === null) {
	displayTimeInTab = false;
} else {
	displayTimeInTab = localStorage.getItem("displayTimeInTab");
	if (displayTimeInTab === "true") {
		displayTimeInTab = true;
	}
	if (displayTimeInTab === "false") {
		displayTimeInTab = false;
	}
}
var enableAHour = true;
if (localStorage.getItem("AHour") === null) {
	enableAHour = true;
} else {
	enableAHour = localStorage.getItem("AHour");
	if (enableAHour === "true") {
		enableAHour = true;
	}
	if (enableAHour === "false") {
		enableAHour = false;
	}
}
var scheduleName;
if (localStorage.getItem("schedule") === null) {
	scheduleName = "regular";
} else {
	scheduleName = localStorage.getItem("schedule");
}
var schoolName;
if (localStorage.getItem("school") === null) {
	schoolName = "rmhs";
} else {
	schoolName = localStorage.getItem("school")
}

function replaceCSS() {
	if (localStorage.getItem("css") !== null) {
		if (document.getElementById("customStyle")) {
			document.getElementById("customStyle").parentNode.removeChild(document.getElementById("customStyle"));
		}
		console.log(encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("useHMS%3A%20true"));
		if (encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("useHMS%3A%20true") >= 0) {
			useHMS = true;
			console.log("always using HMS");
		}
		document.getElementById("mainStylesheet").insertAdjacentHTML("beforebegin", "<style id='customStyle'>" + decodeURIComponent(localStorage.getItem("css")) + "</style>");
		console.log("inserting new CSS");

		if (encodeURIComponent(decodeURIComponent(localStorage.getItem("css"))).indexOf("override%3A%20true") >= 0) {
			document.getElementById("mainStylesheet").parentNode.removeChild(document.getElementById("mainStylesheet"));
			console.log("main CSS overridden");
		}
	}
}

function updateTime() {
	var date;
	if (debug === true) {
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

	if (weekDay === 1) {
		weekDayString = "Monday";
	} else if (weekDay === 2) {
		weekDayString = "Tuesday";
	} else if (weekDay === 3) {
		weekDayString = "Wednesday";
	} else if (weekDay === 4) {
		weekDayString = "Thursday";
	} else if (weekDay === 5) {
		weekDayString = "Friday";
	} else if (weekDay === 6) {
		weekDayString = "Saturday";
	}
	if (hours > 12) {
		hours = hours - 12;
		suffix = "PM";
	} else if (hours === 0) {
		hours = 12;
		suffix = "AM";
	}
	var minutesStr = ('0' + date.getMinutes().toString()).slice(-2);
	var secondsStr = ('0' + date.getSeconds().toString()).slice(-2);

	calculate(date);
	eventSuffix = "AM";
	if (eventHours > 12) {
		eventHours = eventHours - 12;
		eventSuffix = "PM";
	} else if (eventHours === 0) {
		eventHours = 12;
		eventSuffix = "AM";
	}
	var eventMinutesStr = ('0' + eventMinutes.toString()).slice(-2);
	document.getElementById("time").innerHTML = "<br/>Current Time: " + hours + ":" + minutesStr + " " + suffix + " - " + weekDayString + ", " + (month + 1) + "/" + day + "/" + year + "<br/><br/>" + eventName + ": " + eventHours + ":" + eventMinutesStr + " " + eventSuffix + " - " + eventWeekDayString + ", " + (eventMonth + 1) + "/" + eventDay + "/" + eventYear;
}


function calculate(date) {
	var foundNext = false;
	var schedule = jsonData[schoolName][scheduleName].default;
	for (var i = 0; i < jsonData[schoolName][scheduleName].specialDays.length; i++) {
		if (jsonData[schoolName][scheduleName].specialDays[i].type === "weekly") {
			if (weekDay === jsonData[schoolName][scheduleName].specialDays[i].value) {
				schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
			}
		} else if (jsonData[schoolName][scheduleName].specialDays[i].type === "single") {
			if (date.getDate() === jsonData[schoolName][scheduleName].specialDays[i].value[0] && date.getMonth() + 1 === jsonData[schoolName][scheduleName].specialDays[i].value[1]) {
				schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
			}
		} else if (jsonData[schoolName][scheduleName].specialDays[i].type === "range") {
			if (date.getDate() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][0] && date.getDate() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][0] && date.getMonth() + 1 >= jsonData[schoolName][scheduleName].specialDays[i].value[0][1] && date.getMonth() + 1 <= jsonData[schoolName][scheduleName].specialDays[i].value[1][1] && date.getFullYear() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][2] && date.getFullYear() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][2]) {
				schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
			}
		}
	}
	eventDate = new Date(year, month, day);
	for (var i = 0; i < schedule.length; i++) {
		if (enableAHour === false && schedule[i][4] !== "aS" && schedule[i][4] !== "aE") {
			eventDate.setHours(schedule[i][0]);
			eventDate.setMinutes(schedule[i][1]);
			eventDate.setSeconds(schedule[i][2]);
			if (isPast(eventDate, date) === false && eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
				eventName = schedule[i][3];
				document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
				if (displayTimeInTab === true) {
					document.title = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
				} else {
					document.title = "Countdown";
				}
				foundNext = true;
				i = schedule.length;
			}
		}
		if (enableAHour === true && schedule[i][4] !== "bell") {
			eventDate.setHours(schedule[i][0]);
			eventDate.setMinutes(schedule[i][1]);
			eventDate.setSeconds(schedule[i][2]);
			if (isPast(eventDate, date) === false && eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
				eventName = schedule[i][3];
				document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
				if (displayTimeInTab === true) {
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
	while (foundNext === false && addNum < 365) {
		eventDate.setDate(eventDate.getDate() + 1);
		if (eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
			var schedule = jsonData[schoolName][scheduleName].default;
			for (var i = 0; i < jsonData[schoolName][scheduleName].specialDays.length; i++) {
				if (jsonData[schoolName][scheduleName].specialDays[i].type === "weekly") {
					if (eventDate.getDay() === jsonData[schoolName][scheduleName].specialDays[i].value) {
						schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
					}
				} else if (jsonData[schoolName][scheduleName].specialDays[i].type === "single") {
					if (eventDate.getDate() === jsonData[schoolName][scheduleName].specialDays[i].value[0] && eventDate.getMonth() + 1 === jsonData[schoolName][scheduleName].specialDays[i].value[1]) {
						schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
					}
				} else if (jsonData[schoolName][scheduleName].specialDays[i].type === "range") {
					if (eventDate.getDate() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][0] && eventDate.getDate() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][0] && eventDate.getMonth() + 1 >= jsonData[schoolName][scheduleName].specialDays[i].value[0][1] && eventDate.getMonth() + 1 <= jsonData[schoolName][scheduleName].specialDays[i].value[1][1] && eventDate.getFullYear() >= jsonData[schoolName][scheduleName].specialDays[i].value[0][2] && eventDate.getFullYear() <= jsonData[schoolName][scheduleName].specialDays[i].value[1][2]) {
						schedule = jsonData[schoolName][scheduleName][jsonData[schoolName][scheduleName].specialDays[i].scheduleName];
					}
				}
			}
			for (var i = 0; i < schedule.length; i++) {
				if (enableAHour === false && schedule[i][4] !== "aS" && schedule[i][4] !== "aE") {
					eventDate.setHours(schedule[i][0]);
					eventDate.setMinutes(schedule[i][1]);
					eventDate.setSeconds(schedule[i][2]);
					if (isPast(eventDate, date) === false) {
						eventName = schedule[i][3];
						document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
						if (displayTimeInTab === true) {
							document.getElementById("pageTitle").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
						} else {
							document.getElementById("pageTitle").innerHTML = "Countdown";
						}
						foundNext = true;
						i = schedule.length;
					}
				}
				if (enableAHour === true && schedule[i][4] !== "bell") {
					eventDate.setHours(schedule[i][0]);
					eventDate.setMinutes(schedule[i][1]);
					eventDate.setSeconds(schedule[i][2]);
					if (isPast(eventDate, date) === false) {
						eventName = schedule[i][3];
						document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate), "full") + " Until <span id='eventName'>" + eventName + "</span>";
						if (displayTimeInTab === true) {
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
	if (eventWeekDay === 1) {
		eventWeekDayString = "Monday";
	} else if (eventWeekDay === 2) {
		eventWeekDayString = "Tuesday";
	} else if (eventWeekDay === 3) {
		eventWeekDayString = "Wednesday";
	} else if (eventWeekDay === 4) {
		eventWeekDayString = "Thursday";
	} else if (eventWeekDay === 5) {
		eventWeekDayString = "Friday";
	} else if (eventWeekDay === 6) {
		weekDayString = "Saturday";
	}
	eventHours = eventDate.getHours();
	eventMinutes = eventDate.getMinutes();
	eventMonth = eventDate.getMonth();
	eventDay = eventDate.getDate();
	eventYear = eventDate.getFullYear();

}



function msToStr(s, f) {
	var fm = [Math.floor(s / 60 / 60 / 24), Math.floor(s / 60 / 60) % 24, Math.floor(s / 60) % 60, s % 60];
	if (window.innerWidth >= 875 && f === "full" && useHMS === false) {
		if (fm[0] !== 0) {
			return fm[0] + " Days, " + fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
		} else if (fm[1] !== 0) {
			return fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
		} else if (fm[2] !== 0) {
			return fm[2] + " Minutes and " + fm[3] + " Seconds";
		} else {
			return fm[3] + " Seconds";
		}
	} else {
		if (fm[0] !== 0) {
			return fm[0] + "D " + fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
		} else if (fm[1] !== 0) {
			return fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
		} else if (fm[2] !== 0) {
			return fm[2] + "M " + fm[3] + "S";
		} else {
			return fm[3] + "S";
		}
	}
}

function resetCSS() {
	if (confirm("Are you sure you want to delete your custom stylesheet?") === true) {
		localStorage.removeItem("css");
		location.reload();
	}
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

function daysBetween(date1, date2) {
	var date1Ms = date1.getTime();
	var date2Ms = date2.getTime();
	var differenceMs = date2Ms - date1Ms;
	return Math.round(differenceMs / 1000);
}

function isPast(time, currentTime) {
	if (currentTime < time) {
		return false;
	} else {
		return true;
	}
}
var calDate = new Date();
window.onload = function() {
	document.getElementById("settings").onclick = function(e) {
		e.preventDefault();
		if (schoolName === "mtnView" || schoolName === "westwood") {
			dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="A" onchange="updateSchedule(this.value)">Schedule A</option><option value="B" onchange="updateSchedule(this.value)">Schedule B</option></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><br/>Upload custom stylesheet: <input type="file" name="datafile" accept=".css" onchange="handleFiles(this.files)"><input id="CSSReset" type="button" onclick="resetCSS()" value="Reset CSS"/><br/><br/><a href="./stylesheets">Browse Custom Stylesheets</a>"');
			var boxHTML = $("#pageSettings")[0].children[0];
			boxHTML.children[7].value = "A"
		} else {
			dialogueBox('<p><br/>School: <select id="school" onchange="updateSchool(this.value);"><option value="rmhs">Red Mountain High School</option><option value="westwood">Westwood High School</option><option value="mtnView">Mountain View High School</option></select><br/><br/>Schedule: <select id="schedule" onchange="updateSchedule(this.value);"><option value="regular" onchange="updateSchedule(this.value)">Normal Schedule</option><option onchange="updateSchedule(this.value)" value="CORE">CORE Schedule</option>></select><br/><br/><input id="AHour" type="checkbox" onchange="setAHour(this.checked)"/> Display A Hour<br/><br/><input onchange="updateDisplayTab(this.checked)" id="displayTimeInTab" type="checkbox"/> Display Time in Tab</p><br/>Upload custom stylesheet: <input type="file" name="datafile" accept=".css" onchange="handleFiles(this.files)"><input id="CSSReset" type="button" onclick="resetCSS()" value="Reset CSS"/><br/><br/><a href="./stylesheets">Browse Custom Stylesheets</a>');
			var boxHTML = $("#pageSettings")[0].children[0];
			boxHTML.children[7].value = "default"
		}
	}

	updateTime();
	setInterval(updateTime, 1000);
	if (window.location.hash === "#test" || window.location.hash === "#debug") {
		console.log("debug mode");
		debug = true;
		document.getElementById("countdown").insertAdjacentHTML('afterend', '<center><div class="datepicker-here" id="datepicker" data-language="en"></div><br/><h4>It looks like you found the Debug Page! If you would like to go back to the regular site, click <a href="' + window.location.origin + '">here</a>. If you are just woundering how this site works, feel free to look around!</h4></center>');
		$('#datepicker').datepicker({
			timepicker: true,
			onSelect: function(fd, d, picker) {
				if (!d) {
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
	if (school === "mtnView" || school === "westwood") {
		boxHTML.children[4].innerHTML = '<option value="A" onchange="updateSchedule(this.value)">Schedule A</option><option value="B" onchange="updateSchedule(this.value)">Schedule B</option>';
		boxHTML.children[7].value = "A"
		scheduleName = "A";
		localStorage.setItem("schedule", "A");
	}
	if (school === "rmhs") {
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
	if (enableAHour === "true") {
		enableAHour = true;
	}
	if (enableAHour === "false") {
		enableAHour = false;
	}
	localStorage.setItem("AHour", enableAHour);
}

function dialogueBox(content) {
	var dialog = bootbox.dialog({
		message: "<div id='pageSettings'></div>",
	});
	$("#pageSettings").html(content);
	var boxHTML = $("#pageSettings")[0].children[0];
	console.log(boxHTML.children);
	boxHTML.children[1].value = schoolName;
	boxHTML.children[4].value = scheduleName;
	boxHTML.children[7].checked = enableAHour;
	boxHTML.children[10].checked = displayTimeInTab;
}


console.log("index.js loaded (version " + version + ")");