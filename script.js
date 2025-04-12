const API_KEY = '599c9dce740184ee10af63f598e417db';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const HOURLY_ITEMS_TO_SHOW = 24; // Show 24 hours of forecast

// Debug logs
console.log('Weather app script loaded');
console.log('API Key:', API_KEY);
console.log('Base URL:', BASE_URL);

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temp = document.getElementById('temp');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weather-icon');
const forecast = document.getElementById('forecast');

// Expanded weather icons mapping with more detailed conditions
const weatherIcons = {
    // Clear sky
    '01d': { icon: 'fa-sun', color: '#FFB300' },
    '01n': { icon: 'fa-moon', color: '#555' },
    
    // Few clouds
    '02d': { icon: 'fa-cloud-sun', color: '#FFB300' },
    '02n': { icon: 'fa-cloud-moon', color: '#555' },
    
    // Scattered/broken clouds
    '03d': { icon: 'fa-cloud', color: '#7F8C8D' },
    '03n': { icon: 'fa-cloud', color: '#7F8C8D' },
    '04d': { icon: 'fa-clouds', color: '#7F8C8D' },
    '04n': { icon: 'fa-clouds', color: '#7F8C8D' },
    
    // Rain showers
    '09d': { icon: 'fa-cloud-showers-heavy', color: '#3498DB' },
    '09n': { icon: 'fa-cloud-showers-heavy', color: '#3498DB' },
    
    // Rain
    '10d': { icon: 'fa-cloud-sun-rain', color: '#3498DB' },
    '10n': { icon: 'fa-cloud-moon-rain', color: '#3498DB' },
    
    // Thunderstorm
    '11d': { icon: 'fa-bolt-lightning', color: '#F1C40F' },
    '11n': { icon: 'fa-bolt-lightning', color: '#F1C40F' },
    
    // Snow
    '13d': { icon: 'fa-snowflake', color: '#BDC3C7' },
    '13n': { icon: 'fa-snowflake', color: '#BDC3C7' },
    
    // Mist/fog/haze
    '50d': { icon: 'fa-smog', color: '#95A5A6' },
    '50n': { icon: 'fa-smog', color: '#95A5A6' }
};

// Add additional weather condition icons
const additionalIcons = {
    tornado: { icon: 'fa-tornado', color: '#7F8C8D' },
    hurricane: { icon: 'fa-hurricane', color: '#E74C3C' },
    dust: { icon: 'fa-wind', color: '#D35400' },
    sandstorm: { icon: 'fa-wind', color: '#D35400' },
    windy: { icon: 'fa-wind', color: '#7F8C8D' },
    hail: { icon: 'fa-cloud-meatball', color: '#7F8C8D' },
    extreme: { icon: 'fa-triangle-exclamation', color: '#E74C3C' }
};

//mapping for countries to their capital cities
const countryCapitals = {
    'china': 'Beijing',
    'japan': 'Tokyo',
    'korea': 'Seoul',
    'india': 'New Delhi',
    'usa': 'Washington DC',
    'uk': 'London',
};

const countryNames = {
    'CN': 'China',
    'JP': 'Japan',
    'KR': 'South Korea',
    'IN': 'India',
    'US': 'United States',
    'GB': 'United Kingdom',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'ID': 'Indonesia',
    'PH': 'Philippines',
};

function getCapitalCity(input) {
    const lowercaseInput = input.toLowerCase();
    return countryCapitals[lowercaseInput];
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('show');
}

// Updated weather conditions with consistent Font Awesome icons
const weatherConditions = {
    // Clear sky
    '01d': {
        icon: { icon: 'fa-sun', color: '#FFB300' },
        image: 'https://images.unsplash.com/photo-1598717123623-994ab270a041?w=800',
        bgImage: 'https://images.unsplash.com/photo-1598717123623-994ab270a041?w=1920'
    },
    '01n': {
        icon: { icon: 'fa-moon-stars', color: '#555' },
        image: 'https://images.unsplash.com/photo-1532978379970-2c726d4b4432?w=800',
        bgImage: 'https://images.unsplash.com/photo-1532978379970-2c726d4b4432?w=1920'
    },
    
    // Few clouds
    '02d': {
        icon: { icon: 'fa-cloud-sun', color: '#FFB300' },
        image: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800',
        bgImage: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=1920'
    },
    '02n': {
        icon: { icon: 'fa-cloud-moon', color: '#555' },
        image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
        bgImage: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920'
    },
    
    // Scattered clouds
    '03d': {
        icon: { icon: 'fa-cloud-sun', color: '#7F8C8D' },
        image: 'https://images.unsplash.com/photo-1525490829609-d166ddb58678?w=800',
        bgImage: 'https://images.unsplash.com/photo-1525490829609-d166ddb58678?w=1920'
    },
    '03n': {
        icon: { icon: 'fa-cloud-moon', color: '#7F8C8D' },
        image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800',
        bgImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920'
    },
    
    // Broken clouds
    '04d': {
        icon: { icon: 'fa-clouds', color: '#7F8C8D' },
        image: 'https://images.unsplash.com/photo-1483977399921-6cf94f6fdc3a?w=800',
        bgImage: 'https://images.unsplash.com/photo-1483977399921-6cf94f6fdc3a?w=1920'
    },
    '04n': {
        icon: { icon: 'fa-clouds-moon', color: '#7F8C8D' },
        image: 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?w=800',
        bgImage: 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?w=1920'
    },
    
    // Shower rain
    '09d': {
        icon: { icon: 'fa-cloud-showers-heavy', color: '#3498DB' },
        image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800',
        bgImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920'
    },
    '09n': {
        icon: { icon: 'fa-cloud-moon-rain', color: '#3498DB' },
        image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800',
        bgImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1920'
    },
    
    // Rain
    '10d': {
        icon: { icon: 'fa-cloud-sun-rain', color: '#3498DB' },
        image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
        bgImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920'
    },
    '10n': {
        icon: { icon: 'fa-cloud-moon-rain', color: '#3498DB' },
        image: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=800',
        bgImage: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=1920'
    },
    
    // Thunderstorm
    '11d': {
        icon: { icon: 'fa-cloud-bolt', color: '#F1C40F' },
        image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800',
        bgImage: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920'
    },
    '11n': {
        icon: { icon: 'fa-cloud-bolt-moon', color: '#F1C40F' },
        image: 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?w=800',
        bgImage: 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?w=1920'
    },
    
    // Snow
    '13d': {
        icon: { icon: 'fa-cloud-snow', color: '#BDC3C7' },
        image: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=800',
        bgImage: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=1920'
    },
    '13n': {
        icon: { icon: 'fa-cloud-moon-snow', color: '#BDC3C7' },
        image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
        bgImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920'
    },
    
    // Mist/fog
    '50d': {
        icon: { icon: 'fa-cloud-fog', color: '#95A5A6' },
        image: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=800',
        bgImage: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1920'
    },
    '50n': {
        icon: { icon: 'fa-cloud-fog-moon', color: '#95A5A6' },
        image: 'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?w=800',
        bgImage: 'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?w=1920'
    }
};

// Add this to your existing constants
const commonCities = {
    'china': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong'],
    'japan': ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Sapporo'],
    'korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
    'india': ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'],
    'usa': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'uk': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool']
};

// Add this new function to search cities using the API
async function searchCities(query) {
    try {
        const formattedQuery = query.trim().replace(' ', '%20');
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${formattedQuery}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        // Format the results
        return data.map(city => ({
            city: city.name,
            state: city.state,
            country: city.country,
            lat: city.lat,
            lon: city.lon
        }));
    } catch (error) {
        console.error('Error searching cities:', error);
        return [];
    }
}

function showSuggestions(suggestions) {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    suggestions.forEach(({ city, state, country }) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        
        // Create location text with city, state (if available), and country
        let locationText = city;
        if (state) locationText += `, ${state}`;
        locationText += `, ${country}`;
        
        div.innerHTML = `
            <span class="suggestion-city">${city}</span>
            <span class="suggestion-country">${state ? `${state}, ` : ''}${country}</span>
        `;
        
        div.onclick = () => {
            cityInput.value = locationText;
            suggestionsBox.style.display = 'none';
            handleSearch(locationText);
        };
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = 'block';
}

// Update the input event listener to use debouncing
let searchTimeout = null;
cityInput.addEventListener('input', (e) => {
    const input = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Hide suggestions if input is too short
    if (input.length < 2) {
        document.getElementById('suggestions').style.display = 'none';
        return;
    }
    
    // Set new timeout to prevent too many API calls
    searchTimeout = setTimeout(async () => {
        showLoading();
        const suggestions = await searchCities(input);
        hideLoading();
        showSuggestions(suggestions);
    }, 300); // Wait 300ms after last keystroke before searching
});

// Add click outside listener to close suggestions
document.addEventListener('click', (e) => {
    const suggestionsBox = document.getElementById('suggestions');
    const searchBox = document.querySelector('.search-box');
    
    if (!searchBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
    }
});

// Update handleSearch function
async function handleSearch(cityQuery) {
    const city = cityQuery || cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    document.getElementById('suggestions').style.display = 'none';
    showLoading();
    
    try {
        const capitalCity = getCapitalCity(city);
        const searchCity = capitalCity || city;
        
        const weatherData = await fetchWeather(searchCity);
        const forecastData = await fetchForecast(searchCity);
        
        if (capitalCity) {
            const countryCode = weatherData.sys.country;
            showNotification(`Showing weather for ${capitalCity}, ${countryCode}`);
        }
        
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        
        localStorage.setItem('lastSuccessfulCity', searchCity);
    } catch (error) {
        const lastSuccessfulCity = localStorage.getItem('lastSuccessfulCity') || 'Hong Kong';
        showError(`City "${city}" not found. Showing weather for ${lastSuccessfulCity}`);
        handleSearch(lastSuccessfulCity);
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => handleSearch());
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Wait for DOM to be fully loaded before initializing
window.addEventListener('load', () => {
    console.log('Window loaded, fetching initial weather...');
    handleSearch('Hong Kong');
});

// Add this function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.querySelector('.container').insertBefore(notification, document.querySelector('.weather-box'));
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Fetch current weather
async function fetchWeather(city) {
    try {
        const formattedCity = city.replace(' ', '%20');
        // First get coordinates from current weather
        const weatherResponse = await fetch(`${BASE_URL}/weather?q=${formattedCity}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherResponse.json();
        
        if (weatherData.cod === '404' || weatherData.cod === 404) {
            throw new Error('City not found');
        }

        // Use coordinates to get minute forecast (for precipitation)
        const { lat, lon } = weatherData.coord;
        const oneCallResponse = await fetch(
            `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const oneCallData = await oneCallResponse.json();

        // Combine the data
        return {
            ...weatherData,
            precipitation: oneCallData.minutely ? 
                Math.round((oneCallData.minutely[0].precipitation > 0) * 100) : 
                Math.round((weatherData.rain?.['1h'] || 0) > 0 ? 100 : 0)
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
    try {
        const formattedCity = city.replace(' ', '%20');
        const response = await fetch(`${BASE_URL}/forecast?q=${formattedCity}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        
        // Add a minimum delay of 500ms to prevent flickering for fast responses
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (data.cod === '404' || data.cod === 404) {
            throw new Error('City not found');
        }
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    try {
        if (!data || !data.main || !data.weather || !data.wind) {
            throw new Error('Invalid weather data received');
        }

        // Basic weather info updates
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temp.textContent = Math.round(data.main.temp) || '--';
        wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h` || '-- km/h';
        humidity.textContent = `${data.main.humidity}%` || '--%';
        
        // Update precipitation
        const precipElement = document.getElementById('precipitation');
        if (precipElement) {
            precipElement.textContent = `${data.precipitation || 0}%`;
        }
        
        // Update time
        document.getElementById('current-time').textContent = 
            new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        
        // Get weather condition data
        const iconCode = data.weather[0].icon;
        const weatherDesc = data.weather[0].description;
        const condition = weatherConditions[iconCode] || {
            icon: { icon: 'fa-cloud', color: '#7F8C8D' },
            bgImage: 'default-weather.jpg'
        };

        // Update weather icon and container - removed the image, keeping only icon and description
        let weatherContainer = document.querySelector('.weather-icon');
        weatherContainer.innerHTML = `
            <div class="weather-icon-container">
                <i id="weather-icon" class="fas ${condition.icon.icon}" style="color: ${condition.icon.color}"></i>
                <div class="weather-description">${weatherDesc}</div>
            </div>
        `;

        // Update background with fade effect
        const bgElement = document.getElementById('weather-background');
        bgElement.style.opacity = '0';
        setTimeout(() => {
            bgElement.style.backgroundImage = `url('${condition.bgImage}')`;
            bgElement.style.opacity = '1';
        }, 500);

    } catch (error) {
        console.error('Error updating weather UI:', error);
        throw error;
    }
}

// Helper function to preload images
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

// Update UI with forecast data
function updateForecastUI(data) {
    try {
        if (!data || !data.list) {
            throw new Error('Invalid forecast data received');
        }

        const hourlyContainer = document.getElementById('hourly-forecast');
        hourlyContainer.innerHTML = '';
        
        const hourlyForecasts = data.list.slice(0, HOURLY_ITEMS_TO_SHOW);
        
        hourlyForecasts.forEach(item => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            const precipProb = item.pop || 0;
            const iconCode = item.weather[0].icon;
            const iconData = weatherIcons[iconCode] || { icon: 'fa-cloud', color: '#7F8C8D' };
            
            hourlyItem.innerHTML = `
                <div class="time">${formatTime(item.dt)}</div>
                <i class="fas ${iconData.icon}" style="color: ${iconData.color}"></i>
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
                <div class="precipitation">Rain: ${Math.round(precipProb * 100)}%</div>
            `;
            
            hourlyContainer.appendChild(hourlyItem);
        });

        forecast.innerHTML = '';
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        
        dailyForecasts.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const precipProb = item.pop || 0;
            const iconCode = item.weather[0].icon;
            const iconData = weatherIcons[iconCode] || { icon: 'fa-cloud', color: '#7F8C8D' };
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="day">${day}</div>
                <i class="fas ${iconData.icon}" style="color: ${iconData.color}"></i>
                <div class="temp">${Math.round(item.main.temp)}°C</div>
                <div class="precipitation">Rain: ${Math.round(precipProb * 100)}%</div>
            `;
            
            forecast.appendChild(forecastItem);
        });
    } catch (error) {
        console.error('Error updating forecast UI:', error);
        showError(error.message);
    }
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Add a close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
    `;
    closeButton.onclick = function() {
        errorElement.style.display = 'none';
    };
    errorElement.appendChild(closeButton);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorElement.style.display !== 'none') {
            errorElement.style.display = 'none';
        }
    }, 5000);
}