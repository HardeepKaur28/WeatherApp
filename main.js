async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "35c01ffa581850f9ec877bd71e804963"; 
  
    if (searchInput == "") {
      weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    }
  
    async function getLonAndLat() {
      const countryCode = 1;
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodeURL);
      if (!response.ok) {
        console.log("Bad response! ", response.status);
        return;
      }
      const data = await response.json();
      if (data.length == 0) {
        console.log("Something went wrong here.");
        weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
      } else {
        return data[0];
      }
    }
  
    async function getWeatherData(lon, lat) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await fetch(weatherURL);
      if (!response.ok) {
        console.log("Bad response! ", response.status);
        return;
      }
      const data = await response.json();
      weatherDataSection.style.display = "flex";
      weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
      `;
    }
  
    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    if (geocodeData) {
      getWeatherData(geocodeData.lon, geocodeData.lat);
    }
  }
  