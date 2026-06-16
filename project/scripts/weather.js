const weatherSearch = document.querySelector("#weatherSearch");
const locationInput = document.querySelector("#locationInput");
const searchButton = document.querySelector("#searchButton");
const searchStatus = document.querySelector("#searchStatus");
const menuButton = document.querySelector("#menuButton");
const navLinks = document.querySelector("#navLinks");

function query(selector) {
    return document.querySelector(selector);
}

function setText(selector, text) {
    const element = query(selector);
    if (element) element.textContent = text;
}

function setClass(selector, className) {
    const element = query(selector);
    if (element) element.className = className;
}

const weatherCodeMap = {
    0: { text: "Clear sky", icon: "sun" },
    1: { text: "Mainly clear", icon: "sun" },
    2: { text: "Partly cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Fog", icon: "cloud" },
    48: { text: "Depositing rime fog", icon: "cloud" },
    51: { text: "Light drizzle", icon: "showers" },
    53: { text: "Moderate drizzle", icon: "showers" },
    55: { text: "Dense drizzle", icon: "rain" },
    61: { text: "Slight rain", icon: "showers" },
    63: { text: "Moderate rain", icon: "rain" },
    65: { text: "Heavy rain", icon: "rain" },
    71: { text: "Slight snow", icon: "cloud" },
    73: { text: "Moderate snow", icon: "cloud" },
    75: { text: "Heavy snow", icon: "cloud" },
    80: { text: "Slight rain showers", icon: "showers" },
    81: { text: "Moderate rain showers", icon: "showers" },
    82: { text: "Violent rain showers", icon: "rain" },
    95: { text: "Thunderstorm", icon: "rain" },
    96: { text: "Thunderstorm with hail", icon: "rain" },
    99: { text: "Thunderstorm with heavy hail", icon: "rain" }
};

function getWeatherDetails(code) {
    return weatherCodeMap[code] || { text: "Weather data available", icon: "cloud-sun" };
}

function formatTemp(value) {
    return Number.isFinite(value) ? `${Math.round(value)}\u00b0C` : "N/A";
}

function formatDate(dateText, options = { weekday: "short", month: "short", day: "numeric" }) {
    return new Date(`${dateText}T00:00:00`).toLocaleDateString(undefined, options);
}

function todayText() {
    return new Date().toISOString().slice(0, 10);
}

function setStatus(message) {
    if (searchStatus) {
        searchStatus.textContent = message;
    }
}

function setLoading(isLoading) {
    if (searchButton) {
        searchButton.disabled = isLoading;
        searchButton.textContent = isLoading ? "Loading..." : "View Weather";
    }
}

function getStoredLocation() {
    return localStorage.getItem("weatherwise-location") || "Accra, Ghana";
}

function saveLocation(locationName) {
    localStorage.setItem("weatherwise-location", locationName);
}

function normalizeQuery(query) {
    return query.replace(/[\s,]+/g, ' ').trim();
}

async function fetchLocationResults(query, count = 5) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Location lookup failed.");
    }

    const data = await response.json();
    return data.results || [];
}

async function getLocation(query) {
    const attempts = [];
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
        attempts.push(trimmedQuery);
    }

    const normalizedQuery = normalizeQuery(trimmedQuery);
    if (normalizedQuery && normalizedQuery !== trimmedQuery) {
        attempts.push(normalizedQuery);
    }

    const parts = normalizedQuery.split(' ').filter(Boolean);
    if (parts.length >= 2) {
        attempts.push(`${parts[0]} ${parts[parts.length - 1]}`);
        attempts.push(parts.join(' '));
    }

    for (const attempt of attempts) {
        const results = await fetchLocationResults(attempt, 5);
        if (results.length > 0) {
            return results[0];
        }
    }

    throw new Error("Location not found. Try using a city and country, such as 'Accra Ghana'.");
}

async function getWeather(location) {
    const params = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        timezone: "auto",
        past_days: "3",
        forecast_days: "5"
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Weather request failed.");
    }

    return response.json();
}

function getDisplayName(location) {
    const parts = [location.name, location.admin1, location.country].filter(Boolean);
    return [...new Set(parts)].join(", ");
}

function buildForecast(daily) {
    if (!daily || !Array.isArray(daily.time) || daily.time.length === 0) {
        return [];
    }

    const startIndex = daily.time.findIndex((date) => date >= todayText());
    const safeStart = startIndex >= 0 ? startIndex : 0;

    return daily.time.slice(safeStart, safeStart + 5).map((date, index) => {
        const sourceIndex = safeStart + index;
        const code = (daily.weather_code && daily.weather_code[sourceIndex]) || 0;
        const details = getWeatherDetails(code);

        return {
            day: index === 0 ? "Today" : formatDate(date),
            icon: details.icon,
            high: (daily.temperature_2m_max && daily.temperature_2m_max[sourceIndex]) ?? null,
            low: (daily.temperature_2m_min && daily.temperature_2m_min[sourceIndex]) ?? null,
            description: details.text
        };
    });
}

function buildHistory(daily) {
    const todayIndex = daily.time.findIndex((date) => date >= todayText());
    const safeTodayIndex = todayIndex >= 0 ? todayIndex : daily.time.length;
    const startIndex = Math.max(0, safeTodayIndex - 3);

    return daily.time.slice(startIndex, safeTodayIndex).map((date, index) => {
        const sourceIndex = startIndex + index;
        const details = getWeatherDetails(daily.weather_code[sourceIndex]);
        const rainChance = daily.precipitation_probability_max[sourceIndex];
        const wind = daily.wind_speed_10m_max[sourceIndex];

        return {
            day: formatDate(date),
            temp: daily.temperature_2m_max[sourceIndex],
            note: `${details.text}. Rain chance ${rainChance ?? 0}%, wind up to ${Math.round(wind ?? 0)} km/h.`
        };
    }).reverse();
}

function renderForecast(forecast) {
    const container = document.querySelector("#forecastGrid");
    if (!container) {
        return;
    }
    if (!Array.isArray(forecast) || forecast.length === 0) {
        container.innerHTML = '<p class="no-data">No forecast data available.</p>';
        return;
    }

    container.innerHTML = forecast
        .map((day) => `
            <article class="forecast-card">
                <h3>${day.day}</h3>
                <span class="weather-symbol small icon-${day.icon}" aria-hidden="true"></span>
                <p><strong>${formatTemp(day.high)}</strong> / ${formatTemp(day.low)}</p>
                <p>${day.description}</p>
            </article>
        `)
        .join("");
}

function renderHistory(history) {
    const container = document.querySelector("#historyList");
    if (!container) {
        return;
    }
    if (!Array.isArray(history) || history.length === 0) {
        container.innerHTML = '<p class="no-data">No historical data available.</p>';
        return;
    }

    container.innerHTML = history
        .map((day) => `
            <article class="history-item">
                <div>
                    <h3>${day.day}</h3>
                    <p>${day.note}</p>
                </div>
                <span class="history-temp">${formatTemp(day.temp)}</span>
            </article>
        `)
        .join("");
}

function renderWeather(location, weather) {
    const displayName = getDisplayName(location);
    try {
        const currentDetails = weather && weather.current ? getWeatherDetails(weather.current.weather_code) : getWeatherDetails(0);
        const forecast = weather && weather.daily ? buildForecast(weather.daily) : [];
        const history = weather && weather.daily ? buildHistory(weather.daily) : [];

        const weeklyHigh = forecast.length > 0 ? Math.max(...forecast.map((day) => day.high || -Infinity)) : null;
        const rainChance = (weather && weather.daily && Array.isArray(weather.daily.precipitation_probability_max))
            ? Math.max(...weather.daily.precipitation_probability_max.slice(-5).map((chance) => chance ?? 0))
            : 0;

        setText("#savedLocation", location.name);
        setText("#weeklyHigh", weeklyHigh !== null ? formatTemp(weeklyHigh) : "N/A");
        setText("#rainChance", `${rainChance}%`);
        setText("#currentLocation", displayName);
        setClass("#weatherIcon", `weather-symbol icon-${currentDetails.icon} large`);
        if (weather && weather.current) {
            setText("#currentTemp", formatTemp(weather.current.temperature_2m));
            setText("#currentDescription", currentDetails.text);
            setText("#humidity", `${Math.round(weather.current.relative_humidity_2m)}%`);
            setText("#wind", `${Math.round(weather.current.wind_speed_10m)} km/h`);
            setText("#feelsLike", formatTemp(weather.current.apparent_temperature));
            setText("#alertTitle", getAlertTitle(currentDetails.text, rainChance, weather.current.wind_speed_10m));
            setText("#alertMessage", getAlertMessage(rainChance, weather.current.wind_speed_10m));
        }

        renderForecast(forecast);
        renderHistory(history);
        saveLocation(displayName);
    } catch (err) {
        console.error('Error rendering weather:', err);
        renderForecast([]);
        renderHistory([]);
        setStatus('Unable to display forecast/history for this location.');
    }
}

function getAlertTitle(description, rainChance, windSpeed) {
    if (windSpeed >= 35) {
        return "Strong wind advisory";
    }

    if (rainChance >= 60) {
        return "Rain likely this week";
    }

    return description;
}

function getAlertMessage(rainChance, windSpeed) {
    if (windSpeed >= 35) {
        return "Secure light outdoor items and use caution during travel because wind speeds are elevated.";
    }

    if (rainChance >= 60) {
        return "Plan with rain protection nearby. Some outdoor activities may need a backup option.";
    }

    return "Conditions look manageable, but check the forecast before longer travel or outdoor plans.";
}

async function loadWeather(query) {
    setLoading(true);
    setStatus(`Searching for ${query}...`);

    try {
        const location = await getLocation(query);
        setStatus(`Loading weather for ${getDisplayName(location)}...`);
        const weather = await getWeather(location);
        renderWeather(location, weather);
        if (locationInput) {
            locationInput.value = getDisplayName(location);
        }
        setStatus("Weather updated.");
    } catch (error) {
        setStatus(error.message);
    } finally {
        setLoading(false);
    }
}

function setFooterDates() {
    setText("#currentyear", new Date().getFullYear());
    setText("#lastModified", document.lastModified);
}

if (weatherSearch && locationInput) {
    weatherSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = locationInput.value.trim();

        if (query) {
            loadWeather(query);
        }
    });
}

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", isOpen);
    });

    navLinks.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
}

if (locationInput) {
    locationInput.value = getStoredLocation();
    loadWeather(locationInput.value);
} else {
    loadWeather(getStoredLocation());
}

setFooterDates();
