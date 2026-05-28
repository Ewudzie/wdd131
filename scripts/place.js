const temperature = Number(document.querySelector("#temperature").textContent);
const windSpeed = Number(document.querySelector("#wind-speed").textContent);

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

function calculateWindChill(temp, speed) {
  return 35.74 + (0.6215 * temp) - (35.75 * speed ** 0.16) + (0.4275 * temp * speed ** 0.16);
}

const windChill = temperature <= 50 && windSpeed > 3
  ? `${calculateWindChill(temperature, windSpeed).toFixed(1)}&deg;F`
  : "N/A";

document.querySelector("#wind-chill").innerHTML = windChill;
