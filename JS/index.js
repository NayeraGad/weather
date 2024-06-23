const searchInput = document.querySelector(".search");
const forecastCards = document.querySelector(".forecastCards");
const locationBtn = document.querySelector(".fa-location-dot");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
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
  "December",
];

// Get the data of the input city name
async function search(name) {
  try {
    let res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=640a9817d691451eb35152817242206&q=${name}&days=3`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    // Backend response
    let data = await res.json();

    displayCurrent(data);
    displayForecast(data.forecast.forecastday);
  } catch (error) {
    console.log(error);
  }
}

// Get the data of user's current location
async function getCurrentLocation() {
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=640a9817d691451eb35152817242206&q=${latitude},${longitude}`
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      const location = data.location.name;
      searchInput.value = location;
      search(location);

      console.log(location);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Display current weather
function displayCurrent(data) {
  const d = new Date();
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];

  forecastCards.innerHTML = `<div class="currentCard card col-md-12 col-lg-4 px-0">
              <header class="card-header d-flex justify-content-between">
                <span>${day}</span>
                <span>${date} ${month}</span>
              </header>

              <main class="card-body">
                <span>${data.location.name}</span>

                <h2 class="temp text-center">${data.current.temp_c} <sup>o</sup> C</h2>

                <img src="${data.current.condition.icon}" alt="${data.current.condition.text}" />

                <span class="text-info">${data.current.condition.text}</span>

                <ul class="list-unstyled d-flex justify-content-between mt-3">
                  <li class="d-flex align-items-center"><img src="images/icon-umbrella.png" alt="umbrella icon" class="me-1"/> ${data.current.cloud}%</li>

                  <li class="d-flex align-items-center"><img src="images/icon-wind.png" alt="wind icon" class="me-1"/> ${data.current.wind_kph}km/h</li>

                  <li class="d-flex align-items-center"><img src="images/icon-compass.png" alt="compass icon" class="me-1"/> ${data.current.wind_dir}</li>
                </ul>
              </main>
            </div>`;
}

// Display remaining days
function displayForecast(data) {
  for (let i = 1; i < data.length; i++) {
    const d = new Date();
    let dayIndex = (d.getDay() + i) % 7; // Calculate the remainder to stay within the range
    let day = days[dayIndex];

    forecastCards.innerHTML += `<div class="card col-md-6 col-lg-4 px-0 text-center">
      <header class="card-header ">
        <span>${day}</span>
      </header>

      <main class="card-body d-flex flex-column justify-content-center align-items-center ">
        <img src="${data[i].day.condition.icon}" alt="${data[i].day.condition.text}" />

        <h3 class="maxTemp mx-2">
          ${data[i].day.maxtemp_c} <sup>o</sup> C
        </h3>

        <h4 class="minTemp h6">
          ${data[i].day.mintemp_c} <sup>o</sup> C
        </h4>


        <span class="text-info">${data[i].day.condition.text}</span>
      </main>
    </div>`;
  }
}

searchInput.addEventListener("input", function (e) {
  search(e.target.value);
});

locationBtn.addEventListener("click", getCurrentLocation);

search("alexandria");
