/* =========================================
   WEATHER DASHBOARD
   Assignment 4
   Fetch API + Async/Await + JSON
========================================= */


/* =========================================
   API URLs
========================================= */

const GEO_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================
   DOM ELEMENTS
========================================= */

const weatherForm =
    document.getElementById("weatherForm");

const cityInput =
    document.getElementById("cityInput");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const weatherContent =
    document.getElementById("weatherContent");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const uvIndex =
    document.getElementById("uvIndex");

const hourlyForecast =
    document.getElementById("hourlyForecast");


/* =========================================
   WEATHER CODE INFORMATION
========================================= */

const weatherCodes = {

    0: {
        description: "Clear Sky",
        icon: "☀️"
    },

    1: {
        description: "Mainly Clear",
        icon: "🌤️"
    },

    2: {
        description: "Partly Cloudy",
        icon: "⛅"
    },

    3: {
        description: "Overcast",
        icon: "☁️"
    },

    45: {
        description: "Foggy",
        icon: "🌫️"
    },

    48: {
        description: "Rime Fog",
        icon: "🌫️"
    },

    51: {
        description: "Light Drizzle",
        icon: "🌦️"
    },

    53: {
        description: "Drizzle",
        icon: "🌦️"
    },

    55: {
        description: "Heavy Drizzle",
        icon: "🌧️"
    },

    61: {
        description: "Light Rain",
        icon: "🌦️"
    },

    63: {
        description: "Rain",
        icon: "🌧️"
    },

    65: {
        description: "Heavy Rain",
        icon: "🌧️"
    },

    71: {
        description: "Light Snow",
        icon: "🌨️"
    },

    73: {
        description: "Snow",
        icon: "❄️"
    },

    75: {
        description: "Heavy Snow",
        icon: "❄️"
    },

    80: {
        description: "Rain Showers",
        icon: "🌦️"
    },

    81: {
        description: "Rain Showers",
        icon: "🌧️"
    },

    82: {
        description: "Heavy Rain Showers",
        icon: "⛈️"
    },

    95: {
        description: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "Thunderstorm with Hail",
        icon: "⛈️"
    },

    99: {
        description: "Heavy Thunderstorm",
        icon: "⛈️"
    }

};


/* =========================================
   FORM EVENT
========================================= */

weatherForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();

        if (!city) {

            showError(
                "Please enter a city name."
            );

            return;

        }

        getWeather(city);

    }
);


/* =========================================
   MAIN WEATHER FUNCTION
========================================= */

async function getWeather(city) {

    try {

        clearError();

        showLoading(true);


        /*
         * STEP 1
         * Get latitude and longitude
         * from city name.
         */

        const location =
            await getCoordinates(city);


        /*
         * STEP 2
         * Get weather data using
         * latitude and longitude.
         */

        const weather =
            await getWeatherData(
                location.latitude,
                location.longitude
            );


        /*
         * STEP 3
         * Render the JSON response.
         */

        renderWeather(
            location,
            weather
        );


    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        showError(
            error.message ||
            "Unable to retrieve weather data."
        );

    }

    finally {

        showLoading(false);

    }

}


/* =========================================
   GET CITY COORDINATES
========================================= */

async function getCoordinates(city) {

    const url =
        `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    /*
     * HTTP ERROR HANDLING
     */

    if (!response.ok) {

        throw new Error(
            "Unable to connect to the location service."
        );

    }


    /*
     * Convert response to JSON.
     */

    const data =
        await response.json();


    /*
     * Check whether city exists.
     */

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" was not found.`
        );

    }


    return data.results[0];

}


/* =========================================
   GET WEATHER DATA
========================================= */

async function getWeatherData(
    latitude,
    longitude
) {

    const params = new URLSearchParams({

        latitude: latitude,

        longitude: longitude,

        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl",

        hourly:
            "temperature_2m,weather_code",

        daily:
            "uv_index_max",

        timezone: "auto",

        forecast_days: "1"

    });


    const url =
        `${WEATHER_API}?${params.toString()}`;


    const response =
        await fetch(url);


    /*
     * Handle failed REST request.
     */

    if (!response.ok) {

        throw new Error(
            "Weather service is currently unavailable."
        );

    }


    /*
     * Parse JSON.
     */

    const data =
        await response.json();


    return data;

}


/* =========================================
   RENDER WEATHER
========================================= */

function renderWeather(
    location,
    data
) {

    /*
     * Location
     */

    cityName.textContent =
        location.name;

    countryName.textContent =
        `${location.country || ""}`;


    /*
     * Current weather
     */

    const current =
        data.current;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} hPa`;


    /*
     * UV data
     */

    if (
        data.daily &&
        data.daily.uv_index_max
    ) {

        uvIndex.textContent =
            data.daily.uv_index_max[0]
                .toFixed(1);

    } else {

        uvIndex.textContent = "--";

    }


    /*
     * Weather description
     */

    const info =
        getWeatherInfo(
            current.weather_code
        );


    weatherDescription.textContent =
        info.description;


    weatherIcon.textContent =
        info.icon;


    /*
     * Hourly forecast
     */

    renderHourlyForecast(
        data.hourly
    );

}


/* =========================================
   WEATHER CODE FUNCTION
========================================= */

function getWeatherInfo(code) {

    return (
        weatherCodes[code] ||
        {
            description:
                "Unknown Weather",

            icon: "🌍"
        }
    );

}


/* =========================================
   HOURLY FORECAST
========================================= */

function renderHourlyForecast(
    hourly
) {

    hourlyForecast.innerHTML = "";


    /*
     * Display next 6 hours.
     */

    const currentHour =
        new Date().getHours();


    let startIndex =
        hourly.time.findIndex(
            time => {

                const hour =
                    new Date(time)
                        .getHours();

                return hour >= currentHour;

            }
        );


    if (startIndex < 0) {

        startIndex = 0;

    }


    const hours =
        hourly.time.slice(
            startIndex,
            startIndex + 6
        );


    hours.forEach(
        function (time, index) {

            const dataIndex =
                startIndex + index;


            const card =
                document.createElement("article");


            card.className =
                "hour-card";


            const date =
                new Date(time);


            const hourText =
                date.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "numeric"
                    }
                );


            const temp =
                Math.round(
                    hourly.temperature_2m[
                        dataIndex
                    ]
                );


            const info =
                getWeatherInfo(
                    hourly.weather_code[
                        dataIndex
                    ]
                );


            /*
             * Dynamic DOM creation.
             */

            card.innerHTML = `

                <div class="hour-time">
                    ${hourText}
                </div>

                <div class="hour-icon">
                    ${info.icon}
                </div>

                <div class="hour-temp">
                    ${temp}°C
                </div>

            `;


            hourlyForecast.appendChild(
                card
            );

        }
    );

}


/* =========================================
   LOADING STATE
========================================= */

function showLoading(show) {

    if (show) {

        loading.classList.add(
            "show"
        );

        weatherContent.classList.add(
            "hidden"
        );

    } else {

        loading.classList.remove(
            "show"
        );

        weatherContent.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   ERROR HANDLING
========================================= */

function showError(message) {

    errorMessage.textContent =
        message;

}


function clearError() {

    errorMessage.textContent =
        "";

}


/* =========================================
   LOAD DEFAULT CITY
========================================= */

getWeather("Chennai");