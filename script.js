`use strict`;

let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = document.querySelector("#weekDay");
weekDay.innerHTML = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Desember",
];
let currentMonth = now.getMonth();
let month = months[currentMonth];
let date = now.getDate();
let year = now.getFullYear();
let currentDate = document.querySelector("#currentDate");
let seasonBackground = document.querySelector("#container");
// let nextDaysBackground = document.querySelector("#nextdays");
changeBackground();

currentDate.innerHTML = `${month} ${date}, ${year}`;

function changeBackground() {
  if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
    seasonBackground.style.background = `linear-gradient(#64c4ed, #f7f7f7)`;
    // nextDaysBackground.style.background = `linear-gradient(#e1f2fb, #f7f7f7)`;
  }
  if (currentMonth === 2 || currentMonth === 3 || currentMonth === 4) {
    seasonBackground.style.background = `linear-gradient(#4ef037, #f7f7f7)`;
    // nextDaysBackground.style.background = `linear-gradient(#4ef037, #f7f7f7)`;
  }
  if (currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
    seasonBackground.style.background = `linear-gradient(#ffe700, #f7f7f7)`;
    // nextDaysBackground.style.background = `linear-gradient(#fcff82, #f7f7f7)`;
  }
  if (currentMonth === 8 || currentMonth === 9 || currentMonth === 10) {
    seasonBackground.style.background = `linear-gradient(#ffc93c, #f7f7f7)`;
    // nextDaysBackground.style.background = `linear-gradient(#ffc93c, #f7f7f7)`;
  }
}

let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let currentTime = document.querySelector("#currentTime");
currentTime.innerHTML = `${hour}:${minute}`;

function weekDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (day < 6) {
    return days[day + 1];
  } else {
    return "Sun";
  }
}

function displayWeatherNextdays(response) {
  let forecast = response.data.daily;
  let nextDaysElement = document.querySelector("#weather-nextdays");

  let nextDaysHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      nextDaysHTML =
        nextDaysHTML +
        `<div class="col"><p class="week-day">${weekDays(
          forecastDay.dt
        )}</p><div class="nextdays" id="nextdays">
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="55"
        />
        <br />
        <span class="temperature-min">${Math.round(
          forecastDay.temp.min
        )}° ... </span>
        <span class="temperature-max">${Math.round(
          forecastDay.temp.max
        )}°</span>
        </div>
      </div>
      `;
    }
  });
  nextDaysHTML = nextDaysHTML + `</div>`;
  nextDaysElement.innerHTML = nextDaysHTML;
}

function getNextDays(coordinates) {
  console.log(coordinates);
  let apiKey = "961c81b1f2ef4eeae1c215b2ba88c0df";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherNextdays);
}

function currentWeather(response) {
  console.log(response.data);
  let iconElement = document.querySelector("#icon");
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#searchCity");
  let countryElement = document.querySelector("#cityCountry");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#currentHumidity");
  let windElement = document.querySelector("#currentWind");
  let aphorizmElement = document.querySelector(".aphorism");

  celsiusTemperature = Math.round(response.data.main.temp);

  temperatureElement.innerHTML = celsiusTemperature;
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  aphorizmElement.innerHTML = getAphorism(quotes);
  countryElement.innerHTML = response.data.sys.country;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
  getNextDays(response.data.coord);
}

function showFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitElement = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitElement;
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusTemperature = null; // глобальная переменная - global variable

function showCelsius(event) {
  event.preventDefault();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);

function searchCity(city) {
  let apiKey = "0961c81b1f2ef4eeae1c215b2ba88c0df";
  let units = "metric";
  //  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(currentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}
let formaCity = document.querySelector("#formaCity");
formaCity.addEventListener("submit", handleSubmit);

// function showLocation(position) {
//   let apiKey = "961c81b1f2ef4eeae1c215b2ba88c0df";
//   let unit = "metric";
//   //  let units = "imperial";
//   let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${unit}`;
//    axios.get(apiUrl).then(currentWeather);
// }
// searchCity(navigator.geolocation.getCurrentPosition(showLocation));
searchCity("Kyiv");

let quotes = [
  `The weather is perfect. The gods are shining on us.`,
  `Bad weather always looks worse through a window.`,
  `I've never been one to bet on the weather.`,
  `Wherever you go, no matter what the weather,</br> always bring your own sunshine.`,
  `There is no such thing as bad weather,</br> only different kinds of good weather.`,
  `There's no such thing as bad weather, just soft people.`,
  `If you want to see the sunshine, you have to weather the storm.`,
];
function getAphorism(values) {
  const max = values.length - 1;
  const min = 0;
  const index = Math.round(Math.random() * (max - min) + min);
  const result = values[index];
  return result;
}
