const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const weatherInfo = document.querySelector('#weatherInfo');
const pastDataButton = document.querySelector("#past-data-button");
const pastDataContainer = document.querySelector('.past-data');

const API_KEY = '3df5f7c02170f638ee41d071731842ea';

// Set the cityInput value to "Southend-on-Sea"
cityInput.value = 'Southend-on-Sea';

// Load weather data from local storage on page load
window.addEventListener('load', () => {
  const storedWeatherData = getWeatherDataFromLocalStorage(cityInput.value);
  if (storedWeatherData) {
    updateWeatherDisplay(storedWeatherData);
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  fetchWeatherData(city);
});

// Fetch weather data 
function fetchWeatherData(city) {
  const storedWeatherData = getWeatherDataFromLocalStorage(city);

  if (storedWeatherData) {
    // Display data from local storage
    updateWeatherDisplay(storedWeatherData);
  } else {
    // Fetch new data from API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          updateWeatherDisplay(data);
          saveWeatherDataToLocalStorage(city, data);
          saveWeatherDataToDatabase(city, data)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          weatherInfo.innerHTML = 'Sorry! City not found. Please try again.';
        }
      })
      .catch(error => {
        console.error(error);
        weatherInfo.innerHTML = 'Error fetching weather data.';
      });
  }
}

// Function to save weather data to local storage
function saveWeatherDataToLocalStorage(city, data) {
  localStorage.setItem(city, JSON.stringify(data));
}

// Function to retrieve weather data from local storage
function getWeatherDataFromLocalStorage(city) {
  const weatherDataJSON = localStorage.getItem(city);
  return JSON.parse(weatherDataJSON);
}

// Function to show weather in User interface
function updateWeatherDisplay(data) {
  const { name, sys: { country }, dt, weather: [{ description, icon }], main: { temp, pressure, humidity }, wind: { speed }, rain } = data;
  const date = new Date(dt * 1000);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const rainfall = rain ? `${rain['1h']} mm` : 'N/A';
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

  const weatherIcon = document.createElement('img');
  weatherIcon.src = iconUrl;

  weatherInfo.innerHTML = `Day and Date: ${formattedDate} <br> Weather in ${name}, ${country}: <br> ${weatherIcon.outerHTML}<br>Condition: ${description}.<br>Temperature: ${temp}°C<br>Pressure: ${pressure} hPa<br>Wind Speed: ${speed} m/s<br>Humidity: ${humidity}%<br>Rainfall: ${rainfall}`;
}

// Save weather data to the local database
async function saveWeatherDataToDatabase(city, data) {
  try {
    const response = await   fetch("Samyogkoirala_2358296.php", {
      method: "POST", //request to samyogkoirala_2358296.php for sending data
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ city, data })
    });

    return await response.text();
  } catch (error) {
    throw new Error("Error saving data to the database.");
  }
}
// Event listener for "Show Past Data" button
pastDataButton.addEventListener("click", () => {
  pastDataContainer.innerHTML = "Loading past data...";
  
  const searchedCity = cityInput.value;
  
  fetch(`past.php?city=${searchedCity}`)
    .then(response => response.text())
    .then(data => {
      pastDataContainer.innerHTML = data;
    })
    .catch(error => {
      pastDataContainer.innerHTML = "Error loading past data.";
    });
});
