const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feels = document.getElementById("feels");

const condition = document.getElementById("condition");
const message = document.getElementById("message");


// Search button

searchBtn.addEventListener("click", getWeather);


// Press Enter

cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// Main weather function

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }


    message.textContent = "Loading weather...";


    try {

        // Step 1: Find city coordinates

        const locationURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationURL);


        if (!locationResponse.ok) {
            throw new Error("Unable to connect to location service.");
        }


        const locationData = await locationResponse.json();


        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please check the city name.");
        }


        // Nested JSON data

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const foundCity = location.name;
        const country = location.country;


        // Step 2: Get weather data

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error("Weather service is not available.");
        }


        const weatherData = await weatherResponse.json();


        // Read nested current weather object

        const current = weatherData.current;


        // Display data

        cityName.textContent = foundCity;

        countryName.textContent = country;

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            current.relative_humidity_2m;

        wind.textContent =
            current.wind_speed_10m;

        feels.textContent =
            Math.round(current.apparent_temperature);


        condition.textContent =
            getWeatherCondition(current.weather_code);


        message.textContent = "";

    }

    catch (error) {

        message.textContent = error.message;

        cityName.textContent = "--";
        countryName.textContent = "--";

        temperature.textContent = "--";
        humidity.textContent = "--";
        wind.textContent = "--";
        feels.textContent = "--";

        condition.textContent = "--";
    }
}


// Convert weather code to readable condition

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}