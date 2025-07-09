// const apiKey = "5ae39ec8e827591b58c72c90a8040976";

// const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// const searchBox = document.querySelector(".search input"); // Perbaikan typo 'seacrh' jadi 'search'
// const searchBtn = document.querySelector(".search button"); // Perbaikan typo 'seacrh' jadi 'search'
// const weatherIcon = document.querySelector(".weather-icon");
// async function checkWeather(city) {
//   try {
//     const response = await fetch(apiUrl + `q=${city}&appid=${apiKey}`);

//     if (!response.ok) {
//       if (response.status === 404) {
//         alert("Kota tidak ditemukan. Mohon cek kembali nama kota.");
//       } else {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return;
//     }

//     var data = await response.json();
//     console.log(data);

//     document.querySelector(".city").innerHTML = data.name;
//     document.querySelector(".temp").innerHTML =
//       Math.round(data.main.temp) + "°c";
//     document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
//     document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

//     if (data.weather[0].main == "Clouds") {
//       weatherIcon.src = "images/clouds.png";
//     } else if (data.weather[0].main == "Clear") {
//       weatherIcon.src = "images/clear.png";
//     } else if (data.weather[0].main == "Rain") {
//       weatherIcon.src = "images/rain.png";
//     } else if (data.weather[0].main == "Drizzle") {
//       weatherIcon.src = "images/drizzle.png";
//     } else if (data.weather[0].main == "Mist") {
//       weatherIcon.src = "images/mist.png";
//     }
//   } catch (error) {
//     console.error("Ada masalah saat mengambil data cuaca:", error);
//   }
// }

// searchBtn.addEventListener("click", () => {
//   if (searchBox.value) {
//     checkWeather(searchBox.value);
//   } else {
//     alert("Silakan masukkan nama kota.");
//   }
// });

// checkWeather("Jakarta");

// // Fungsi untuk toggle tema
// function toggleTheme() {
//   document.body.classList.toggle("light-theme");
//   if (document.body.classList.contains("light-theme")) {
//     localStorage.setItem("theme", "light");
//   } else {
//     localStorage.setItem("theme", "dark");
//   }
// }

// // Load theme preference on page load
// document.addEventListener("DOMContentLoaded", () => {
//   const savedTheme = localStorage.getItem("theme");
//   if (savedTheme === "light") {
//     document.body.classList.add("light-theme");
//   } else {
//     document.body.classList.remove("light-theme");
//   }
//   checkWeather("Indramayu");
// });

// // Mousemove effect for card
// document.addEventListener("mousemove", (e) => {
//   const card = document.querySelector(".card");
//   const rect = card.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//   card.style.setProperty("--mouse-x", `${x}px`);
//   card.style.setProperty("--mouse-y", `${y}px`);
// });

const apiKey = "5ae39ec8e827591b58c72c90a8040976";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const forecastApiUrl =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const loadingSpinner = document.querySelector(".loading");
const weatherDisplay = document.querySelector(".weather");
const weatherNotFound = document.querySelector(".weather-not-found");
const toastNotification = document.getElementById("toastNotification");
const forecastSection = document.querySelector(".forecast");
const forecastDaysContainer = document.querySelector(".forecast-days");
const additionalInfoSection = document.querySelector(".additional-info");

// Fungsi untuk menampilkan toast notification
function showToast(message, type = "info") {
  toastNotification.textContent = message;
  toastNotification.className = `toast show ${type}`;
  setTimeout(() => {
    toastNotification.classList.remove("show");
  }, 3000);
}

// Fungsi untuk memperbarui icon cuaca
function updateWeatherIcon(weatherCondition) {
  let iconSrc = "images/";
  switch (weatherCondition) {
    case "Clear":
      iconSrc += "clear.png";
      break;
    case "Clouds":
      iconSrc += "clouds.png";
      break;
    case "Rain":
      iconSrc += "rain.png";
      break;
    case "Drizzle":
      iconSrc += "drizzle.png";
      break;
    case "Mist":
    case "Fog":
    case "Haze":
      iconSrc += "mist.png";
      break;
    case "Snow":
      iconSrc += "snow.png";
      break;
    case "Thunderstorm":
      iconSrc += "thunderstorm.png";
      break;
    default:
      iconSrc += "clear.png";
  }
  weatherIcon.src = iconSrc;
}

// Fungsi untuk memperbarui UI cuaca
function updateWeatherUI(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML =
    Math.round(data.wind.speed * 3.6) + " km/h";

  // Update additional info
  document.getElementById("feels-like").innerHTML =
    Math.round(data.main.feels_like) + "°C";
  document.getElementById("pressure").innerHTML = data.main.pressure + " hPa";
  document.getElementById("visibility").innerHTML =
    (data.visibility / 1000).toFixed(1) + " km";

  const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  document.getElementById("sunrise").innerHTML = sunriseTime;
  document.getElementById("sunset").innerHTML = sunsetTime;

  updateWeatherIcon(data.weather[0].main);

  // Tampilkan bagian cuaca dan info tambahan
  weatherDisplay.classList.add("active");
  additionalInfoSection.style.display = "grid";
  weatherNotFound.classList.remove("active");
}

// Fungsi untuk mengambil prakiraan 5 hari
async function getForecast(city) {
  try {
    const response = await fetch(forecastApiUrl + `q=${city}&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error("Gagal mengambil prakiraan cuaca:", error);
  }
}

// Fungsi untuk menampilkan prakiraan 5 hari
function displayForecast(data) {
  forecastDaysContainer.innerHTML = "";
  const dailyData = {};

  // Filter data untuk mendapatkan satu entri per hari (sekitar tengah hari)
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const hour = date.getHours();

    if (
      !dailyData[day] ||
      Math.abs(hour - 12) <
        Math.abs(new Date(dailyData[day].dt * 1000).getHours() - 12)
    ) {
      dailyData[day] = item;
    }
  });

  // Tampilkan hanya 5 hari ke depan
  const daysToShow = Object.keys(dailyData).slice(0, 5);

  daysToShow.forEach((dayName) => {
    const dayData = dailyData[dayName];
    const temp = Math.round(dayData.main.temp);
    const iconCode = dayData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const forecastDayDiv = document.createElement("div");
    forecastDayDiv.className = "forecast-day";
    forecastDayDiv.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="${iconUrl}" class="forecast-icon" alt="Forecast Icon">
            <p class="forecast-temp">${temp}°</p>
          `;
    forecastDaysContainer.appendChild(forecastDayDiv);
  });
  forecastSection.style.display = "block";
}

// Fungsi utama untuk memeriksa cuaca
async function checkWeather(city) {
  weatherDisplay.classList.remove("active");
  additionalInfoSection.style.display = "none";
  forecastSection.style.display = "none";
  weatherNotFound.classList.remove("active");
  loadingSpinner.style.display = "block";

  try {
    const response = await fetch(apiUrl + `q=${city}&appid=${apiKey}`);

    if (!response.ok) {
      loadingSpinner.style.display = "none";
      if (response.status === 404) {
        weatherNotFound.classList.add("active");
        showToast(
          "Kota tidak ditemukan. Mohon cek kembali nama kota.",
          "error"
        );
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return;
    }

    const data = await response.json();
    console.log(data);

    updateWeatherUI(data);
    getForecast(city);
  } catch (error) {
    loadingSpinner.style.display = "none";
    console.error("Ada masalah saat mengambil data cuaca:", error);
    weatherNotFound.classList.add("active");
    showToast("Gagal mengambil data cuaca. Coba lagi nanti.", "error");
  } finally {
    loadingSpinner.style.display = "none";
  }
}

// Event listener untuk tombol search
function searchWeather() {
  const city = searchBox.value.trim();
  if (city) {
    checkWeather(city);
  } else {
    showToast("Silakan masukkan nama kota.", "error");
  }
}

// Event listener untuk Enter key pada input search
searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});

// Fungsi untuk mendapatkan lokasi saat ini
function getCurrentLocation() {
  if (navigator.geolocation) {
    loadingSpinner.style.display = "block";
    weatherDisplay.classList.remove("active");
    additionalInfoSection.style.display = "none";
    forecastSection.style.display = "none";
    weatherNotFound.classList.remove("active");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
          const response = await fetch(geoApiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          checkWeather(data.name);
          showToast(`Cuaca di lokasi Anda: ${data.name}`, "success");
        } catch (error) {
          console.error("Gagal mendapatkan nama kota dari koordinat:", error);
          showToast(
            "Gagal mendeteksi lokasi atau mengambil data cuaca.",
            "error"
          );
          loadingSpinner.style.display = "none";
          weatherNotFound.classList.add("active");
        }
      },
      (error) => {
        loadingSpinner.style.display = "none";
        console.error("Error getting geolocation:", error);
        showToast(
          "Gagal mendapatkan lokasi Anda. Pastikan layanan lokasi diaktifkan.",
          "error"
        );
        weatherNotFound.classList.add("active");
      }
    );
  } else {
    showToast("Geolocation tidak didukung oleh browser Anda.", "error");
  }
}

// Fungsi untuk toggle tema
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// Load theme preference on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }
  checkWeather("Indramayu");
});

// Mousemove effect for card
document.addEventListener("mousemove", (e) => {
  const card = document.querySelector(".card");
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
});
