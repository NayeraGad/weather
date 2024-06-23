const searchInput = document.querySelector(".search");
const forecastCards = document.querySelector(".forecastCards");

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

    console.log(res);

    if (!res.ok) {
      throw new Error(res.status);
    }

    // Backend response
    let data = await res.json();

    console.log(data);
    console.log(data.forecast);
    displayCurrent(data);
    displayForecast(data.forecast.forecastday);
  } catch (error) {
    console.log(error);
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

    console.log(day);

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

search("alexandria");
