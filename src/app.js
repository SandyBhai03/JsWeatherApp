const API_KEY = "74ed2987a09dd08dfd0f088a1e22f510";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const searchBtn = document.getElementById("search-city-btn");
const searchByLocation = document.getElementById("search-location-btn");
const currWeatherImg = document.getElementById("curr-img");
const forecastCards = document.querySelectorAll(".card");
const recentCitiesDiv = document.getElementById("recent-cities");
const cityInput = document.getElementById("city-input");

// Variables to store recent searches
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Function Update recent cities dropdown
function updateRecentCities(city) {
  if (!recentCities.includes(city)) {
    recentCities.unshift(city);
    if (recentCities.length > 5) recentCities.pop(); // Limit to 5 cities
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  renderRecentCities();
}

// Function Render recent cities dropdown
function renderRecentCities() {
  recentCitiesDiv.innerHTML = recentCities
    .map(
      (city) =>
        `<button id="recent-city" class="dropdown-item text-left mb-2 mt-1 px-2 py-1 hover:bg-slate-200 cursor-pointer rounded">${city}</button>`
    )
    .join("");

  // Add event listeners to dropdown li
  document.querySelectorAll(".dropdown-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      getCurrentWeatherData(btn.textContent);
      getForcastData(btn.textContent);
      cityInput.value = `${btn.textContent}`;
    });
  });
}

// Function to display errors
function displayError(message) {
  const errorContainer = document.getElementById("error");
  errorContainer.parentElement.classList.remove("hidden");
  errorContainer.parentElement.classList.add("flex");
  errorContainer.innerText = message;

  // Automatically hide error after 3 seconds
  setTimeout(() => {
    errorContainer.innerText = "";
    errorContainer.parentElement.classList.remove("flex");
    errorContainer.parentElement.classList.add("hidden");
  }, 3000);
}

// Display Current Weather Data
function displayCurrentWeatherData(data) {
  console.log(data)
  // Convert the Unix timestamp to a JavaScript Date object
  const date = new Date(data.dt * 1000);
  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const cityName = (document.getElementById(
    "city-name"
  ).innerText = `${data.name}`);
  const currTemp = (document.getElementById(
    "curr-temp"
  ).innerText = `Temperature: ${data.main.temp}°C`);
  const currWind = (document.getElementById(
    "curr-wind"
  ).innerText = `Wind: ${data.wind.speed}M/S`);
  const currHumidity = (document.getElementById(
    "curr-humi"
  ).innerText = `Humidity: ${data.main.humidity}%`);
  const currDate = (document.getElementById(
    "curr-date"
  ).innerText = `(${formattedDate})`);

  setImages(data); // call function to set Images according weather
}

// function to set current Weather Images
function setImages(data) {
  if (data.weather[0].main == "Clear") {
    currWeatherImg.src = "../public/images/clear.png";
  } else if (data.weather[0].main == "Clouds") {
    currWeatherImg.src = "../public/images/clouds.png";
  } else if (data.weather[0].main == "Snow") {
    currWeatherImg.src = "../public/images/snow.png";
  } else if (data.weather[0].main == "Rain") {
    currWeatherImg.src = "../public/images/rain.png";
  } else if (data.weather[0].main == "Mist") {
    currWeatherImg.src = "../public/images/mist.png";
  } else if (data.weather[0].main == "Drizzle") {
    currWeatherImg.src = "../public/images/drizzle.png";
  } else if (data.weather[0].main === "Haze") {
    currWeatherImg.src = "../public/images/haze.png";
  }
}

// function to Display Forecast data
function displayForecastData(data) {
  console.log(data.list)
  const forecastWeatherData = data.list
    .filter((_, index) => index % 7 === 2)
    .slice(1); // Start from the 2nd day data
  forecastWeatherData.forEach((currdata, idx) => {
    const currCard = forecastCards[idx]; // Get the corresponding card.
    // Convert the Unix timestamp to a JavaScript Date object
    const date = new Date(currdata.dt * 1000);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const currForeDate = currCard.querySelector("#forDate");
    const currForeTemp = currCard.querySelector("#forTemp");
    const currForeWind = currCard.querySelector("#forWind");
    const currForeHumi = currCard.querySelector("#forHumi");
    const currForeImg = currCard.querySelector("#forImg");
    setForecastImages(currdata, currForeImg);
    currForeDate.innerText = `(${formattedDate})`;
    currForeTemp.innerText = `Temp: ${(currdata.main.temp - 273.15).toFixed(
      2
    )} °C`;
    currForeWind.innerText = `Wind: ${currdata.wind.speed} M/S`;
    currForeHumi.innerText = `Humidity: ${currdata.main.humidity} %`;
  });

  //function to set images for Forecast cards
  function setForecastImages(data, currForeImg) {
    if (data.weather[0].main === "Clear") {
      currForeImg.src = "../public/images/clear.png";
    } else if (data.weather[0].main === "Clouds") {
      currForeImg.src = "../public/images/clouds.png";
    } else if (data.weather[0].main === "Snow") {
      currForeImg.src = "../public/images/snow.png";
    } else if (data.weather[0].main === "Rain") {
      currForeImg.src = "../public/images/rain.png";
    } else if (data.weather[0].main === "Mist") {
      currForeImg.src = "../public/images/mist.png";
    } else if (data.weather[0].main === "Drizzle") {
      currForeImg.src = "../public/images/drizzle.png";
    } else if (data.weather[0].main === "Haze") {
      currForeImg.src = "../public/images/haze.png";
    }
  }
}

// Function to fetch  Current Weather data By City Name
async function getCurrentWeatherData(city) {
  try {
    if (!city.trim()) throw new Error("City name cannot be empty or invalid."); // Trim check
    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name.");
      } else {
        throw new Error("Something went wrong while fetching the data.");
      }
    }
    const data = await response.json();
    displayCurrentWeatherData(data); // call for display current weather data
    updateRecentCities(city); // call for add in recent cities
  } catch (error) {
    clearWeatherDisplay(); // Clear previous data on error
    displayError(error.message);
  }
}

// Function to fetch Forecast Weather Data By City Name
async function getForcastData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("Extended forecast not available");
    const data = await response.json();
    displayForecastData(data);
  } catch (error) {
    displayError(error.message);
  }
}

// function to get Current Weather data by location
async function getCurrentWeatherDataByLocation(lat, lon) {
  try {
    const response = await fetch(
      `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayCurrentWeatherData(data);
  } catch (error) {
    displayError(error.message);
  }
}

// function to get Forecast Weather data by location
function getForecastWeatherDataByLocation(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data); // Contains the weather forecast data
      displayForecastData(data);
    })
    .catch((error) => {
      alert("Error fetching weather data:", error);
    });
}

// Function to clear wheather display
function clearWeatherDisplay() {
  // Clear current weather data
  document.getElementById("city-name").innerText = "";
  document.getElementById("curr-temp").innerText = "";
  document.getElementById("curr-wind").innerText = "";
  document.getElementById("curr-humi").innerText = "";
  document.getElementById("curr-date").innerText = "";
  currWeatherImg.src = ""; // Reset the weather image

  // Clear forecast cards
  forecastCards.forEach(card => {
    card.querySelector("#forDate").innerText = "";
    card.querySelector("#forTemp").innerText = "";
    card.querySelector("#forWind").innerText = "";
    card.querySelector("#forHumi").innerText = "";
    card.querySelector("#forImg").src = "";
  });
}

// Add addEventListener on Search button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const cityInput = document.getElementById("city-input");
  const cityInputValue = cityInput.value.trim();
  if (cityInputValue !== "") {
    getCurrentWeatherData(cityInputValue);
    getForcastData(cityInputValue);
    cityInput.value = "";
  } else {
    displayError("Please enter a valid city name.");
    return;
  }
});

// Add addEventListener on Location button
searchByLocation.addEventListener("click", (e) => {
  e.preventDefault();
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getCurrentWeatherDataByLocation(latitude, longitude);
        getForecastWeatherDataByLocation(latitude, longitude);
      },
      (error) => {
        displayError("Could not fetch location.");
      }
    );
  } else {
    displayError("Geolocation is not supported by this browser.");
    return;
  }
});

// On Page Load: Load and Render Recent Cities
document.addEventListener('DOMContentLoaded', () => {
  const storedCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  renderRecentCities(storedCities);
});

// get Weather data and Forecast data on Loeaded Browser
document.addEventListener('DOMContentLoaded', () => {
  getCurrentWeatherData("bhopal");
  getForcastData("bhopal");

  const toast = document.getElementById('toast');
  
  // Show the toast
  toast.classList.remove('hidden', 'translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // Hide the toast after 5 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('hidden'); // Fully hide after transition
    }, 300); // Matches the Tailwind transition duration
  }, 2000); // Toast visible for 5 seconds
});

//-------------------------
//GSAP Animation function

function customAnimate() {
  const tl = gsap.timeline();
  tl.from("body", {
    y: -300,
    duration: 0.5,
    opacity: 0.5,
  })
  tl.from("#bg-blur", {
    y: -980,
    duration: 0.7,
    opacity: 0.5,
    stagger: .7,
  })
  tl.from("#bg-img", {
    y: -980,
    duration: 0.7,
    opacity: 0.5,
    stagger: .7,
  })
  tl.from("header,#search-card, #current-weather-card", {
    y: -300,
    scale: 0,
    duration: 0.7,
    opacity: 0,
    stagger: 0.5,

  });
}
customAnimate();

