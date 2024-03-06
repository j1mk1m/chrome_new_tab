// Reminder & Shortcuts Section
let entries = {},
    completed = {},
    shortcuts = {};

let reminder = {
    add : function (text) {
        if (text != '') {
            let key = Date.now();
            if (localStorage.entries){
                entries = JSON.parse(localStorage.entries);
            }
            entries[key] = text;
            localStorage.entries = JSON.stringify(entries);
            document.getElementById('enter').value = '';
            reminder.show();
        }
        document.getElementById('enter').focus();
    },
    show : function () {
        if (localStorage.entries) {
            entries = JSON.parse(localStorage.entries);
        }
        for (let key in entries) {
            let newSection = document.createElement('section'),
            textbox = document.createElement('input'),
            xbox = document.createElement('input');
            newSection.id = key;
            newSection.appendChild(textbox);
            newSection.appendChild(xbox);
    
            textbox.type = 'text';
            textbox.value = entries[key];
            textbox.addEventListener('blur', (event) => {reminder.edit(key, event.target.value)});
            xbox.type = 'button';
            xbox.value = 'x';
            xbox.addEventListener('click', () => {reminder.deleteTask(key)});

            let body = document.getElementById("reminders-pannel");
            if (!document.getElementById(key)) {
                body.insertBefore(newSection, document.getElementById("section-userinput"));
            }
        }
    },
    edit : function (id, text) {
        entries = JSON.parse(localStorage.entries);
        entries[id] = text;
        localStorage.entries = JSON.stringify(entries);
    },
    deleteTask : function (id) {
        entries = JSON.parse(localStorage.entries);
        if (localStorage.completed){
            completed = JSON.parse(localStorage.completed);
        }
        completed[id] = entries[id];
        delete entries[id];
        localStorage.entries = JSON.stringify(entries);
        localStorage.completed = JSON.stringify(completed);
        reminder.show();
        document.getElementById(id).remove();
    }
}

let shortcut = {
    add : function () {
        let name = document.getElementById('name');
        let url = document.getElementById('url');
        if (name.value != "" && url.value != "") {
            if (localStorage.shortcuts) {
                shortcuts = JSON.parse(localStorage.shortcuts);
            }
            let modURL = url.value.indexOf('https://') == 0 ? url.value : "https://" + url.value;
            let key = Date.now();
            shortcuts[key] = [name.value, modURL];
            localStorage.shortcuts = JSON.stringify(shortcuts);
            name.value = "";
            url.value = "";
            shortcut.show();
        }
        document.getElementById("name").focus();
    },
    show : function () {
        if (localStorage.shortcuts){
            shortcuts = JSON.parse(localStorage.shortcuts);
        }
        for (let key in shortcuts) {
            let arr = shortcuts[key];
            let name = arr[0];
            let url = arr[1];

            let pannel = document.createElement("section");
            pannel.id = key;

            let link = document.createElement("a");
            link.href = url;
            link.innerHTML = name;

            let xbox = document.createElement("input")
            xbox.type = 'button';
            xbox.value = 'x';
            xbox.addEventListener('click', () => {shortcut.remove(key)});

            pannel.appendChild(link);
            pannel.appendChild(xbox);
            let body = document.getElementById("shortcuts-pannel");
            if (!document.getElementById(key)){
                body.appendChild(pannel);
            }
        }
    },
    remove : function (id) {
        if (localStorage.shortcuts){
            shortcuts = JSON.parse(localStorage.shortcuts);
        }
        delete shortcuts[id];
        localStorage.shortcuts = JSON.stringify(shortcuts);
        shortcut.show();
        document.getElementById(id).remove();
    }
}
reminder.show();
shortcut.show();

document.getElementById("reminder-button").addEventListener("click", () => {reminder.add (document.getElementById('enter').value)});
document.getElementById("shortcut-button").addEventListener('submit', () => {shortcut.add()});

// Search Section
document.getElementById("search-form").addEventListener('submit', (e) => {
    e.preventDefault();
    let input = document.getElementById("search-input");
    location.href = "https://www.google.com/search?q="+(input.value);
});


// Time/Date Section
let centerEl = document.getElementById("time-section");
let dateSectionEl = document.getElementById('date-section');
let timeEl = document.createElement('h1');
let ampmEl = document.createElement('h5');
let dateEl = document.createElement('h3');
timeEl.id = 'time';
ampmEl.id = 'ampm';
dateEl.id = 'date';
centerEl.appendChild(timeEl);
centerEl.appendChild(ampmEl);
dateSectionEl.appendChild(dateEl);

const updateTime = () => {
    let timeEl = document.getElementById('time');
    let ampmEl = document.getElementById('ampm');
    let dateEl = document.getElementById('date');
    let time = new Date();
    let timeString = time.toLocaleTimeString();
    timeEl.innerHTML = timeString.substring(0, timeString.length-3);
    ampmEl.innerHTML = timeString.substring(timeString.length - 2, timeString.length);
    dateEl.innerHTML = time.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
}
updateTime();
setInterval(updateTime, 1000);

// Weather Section
let weatherEl = document.getElementById("weather")
let weatherURL = "https://api.weather.gov/"

let hourlyEl = document.getElementById('hourly');
let dailyEl = document.getElementById('daily');

const createWeatherItem = (element, hourly) => {
    let newEl = document.createElement('div');
    newEl.className = "weather-item";
    let timeEl = document.createElement('p');
    let timeBold = document.createElement('b');
    timeEl.appendChild(timeBold);
    let tempEl = document.createElement('p');
    let precpEl = document.createElement('p');
    let imageEl = document.createElement('i');

    timeEl.className = "weather-line";
    tempEl.className = "weather-line";
    precpEl.className = "weather-line";

    let desc = element.shortForecast;
    if (desc.includes("Rain")) {
        imageEl.className = "fas fa-umbrella";
    } else if (desc.includes("Cloud")) {
        imageEl.className = "fas fa-cloud";
    } else {
        imageEl.className = "fas fa-sun";
    }
    imageEl.setAttribute('title', desc);

    let date = new Date(element.startTime)
    if (hourly) {
        timeBold.innerHTML = date.getHours() > 12 ? (date.getHours() - 12).toString() + "pm" : date.getHours() + "am";
    } else {
        timeBold.innerHTML = date.getMonth() + "/" + date.getDate() + (date.getHours() < 18 ? " M" : " A");
    }
    tempEl.innerHTML = element.temperature + ' F';
    precpEl.innerHTML = element.probabilityOfPrecipitation.value == null ? "0%" : element.probabilityOfPrecipitation.value + '%';

    newEl.appendChild(timeEl);
    newEl.appendChild(imageEl);
    newEl.appendChild(tempEl);
    newEl.appendChild(precpEl);

    return newEl;
}

const displayWeatherHourly = (periods) => {
    let curTime = new Date();
    let start = 0;
    let ptime = new Date(periods[0].startTime);
    while (curTime > ptime) {
        start += 1;
        ptime = new Date(periods[start].startTime);
    }
    for (let index = start - 1; index < start + 23; index++) {
        const element = periods[index];

        let newEl = createWeatherItem(element, true);
        hourlyEl.appendChild(newEl);
    }
}

const displayWeatherDaily = (periods) => {
    let curTime = new Date();
    let start = 0;
    let ptime = new Date(periods[0].startTime);
    while (curTime > ptime) {
        start += 1;
        ptime = new Date(periods[start].startTime);
    }
    for (let index = start - 1; index < start + 8; index++) {
        const element = periods[index];

        let newEl = createWeatherItem(element, false);
        dailyEl.appendChild(newEl);
    } 
}

const fetchWeatherData = (latitude, longitude) => {
    fetch(weatherURL + "points/" + latitude.toString() + "," + longitude.toString())
    .then((response) => response.json())
    .then((json) => {
        fetch(json.properties.forecastHourly)
            .then((response) => response.json())
            .then((json) => {
                localStorage.weatherHourly = JSON.stringify(json.properties.periods);
            });
        fetch(json.properties.forecast)
            .then((response) => response.json())
            .then((json) => {
                localStorage.weatherDaily = JSON.stringify(json.properties.periods);
            });
    });
    localStorage.weatherUpdate = Date.now();
}

const refreshWeather = () => {
    console.log("Refreshing Weather");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
        });
    } else {
        weatherEl.innerHTML = "Cannot find current location"
    }
}

if (localStorage.weatherUpdate != undefined && Number(localStorage.weatherUpdate) + 1000 * 60 * 60 * 24 > Date.now()) {
    displayWeatherHourly(JSON.parse(localStorage.weatherHourly));
    displayWeatherDaily(JSON.parse(localStorage.weatherDaily));
} else {
    refreshWeather();
    displayWeatherHourly(JSON.parse(localStorage.weatherHourly));
    displayWeatherDaily(JSON.parse(localStorage.weatherDaily));
}
