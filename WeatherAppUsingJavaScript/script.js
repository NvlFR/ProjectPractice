const apiKey = "5ae39ec8e827591b58c72c90a8040976";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

const searchBox = document.querySelector(".search input"); // Perbaikan typo 'seacrh' jadi 'search'
const searchBtn = document.querySelector(".search button"); // Perbaikan typo 'seacrh' jadi 'search'
const weatherIcon = document.querySelector(".weather-icon");
async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + `q=${city}&appid=${apiKey}`);

    if (!response.ok) {
      if (response.status === 404) {
        alert("Kota tidak ditemukan. Mohon cek kembali nama kota.");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return;
    }

    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }
  } catch (error) {
    console.error("Ada masalah saat mengambil data cuaca:", error);
  }
}

searchBtn.addEventListener("click", () => {
  if (searchBox.value) {
    checkWeather(searchBox.value);
  } else {
    alert("Silakan masukkan nama kota.");
  }
});

checkWeather("Jakarta");
