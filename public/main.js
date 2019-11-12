const qS = e => document.querySelector(e)
const apiURL = 'https://api.openweathermap.org/data/2.5/weather'
const appid = 'a9912898d642cb04a000d534b4f8653a'

let defaultCityZipCountry

const fetchWeather = async cityZipCountry => {
  console.log('City: ' + cityZipCountry)
  const apiCall = apiURL + '?q=' + cityZipCountry + '&appid=' + appid
  console.log('API-call: ' + apiCall)
  const resp = await fetch(apiCall)
  const weather = await resp.json()
  // qS('.responseContainer').textContent
  const weatherString =
    weather.name +
    ': ' +
    weather.weather[0].main +
    ', ' +
    Math.round(k2c(parseFloat(weather.main.temp)), 1) +
    '°C (' +
    Math.round(k2f(parseFloat(weather.main.temp)), 1) +
    '°F)'
  const weatherP = document.createElement('p')
  weatherP.textContent = weatherString
  qS('.responseContainer').insertBefore(
    weatherP,
    qS('.responseContainer').firstChild
  )
}

const requestWeather = () => {
  let cityZipCountry = qS('.cityZipCountry').value

  if (cityZipCountry === '' || cityZipCountry === defaultCityZipCountry) {
    window.alert('Please provide a valid city name or US zip-code.')
    return
  }
  if (!isNaN(cityZipCountry)) {
    cityZipCountry = cityZipCountry + ',us'
  }
  fetchWeather(cityZipCountry)
}

const clearInput = () => {
  if (qS('.cityZipCountry').value === defaultCityZipCountry) {
    qS('.cityZipCountry').value = ''
  }
}

const reinsertInput = () => {
  if (qS('.cityZipCountry').value === '') {
    qS('.cityZipCountry').value = defaultCityZipCountry
  }
}

const saveDefaults = () => {
  defaultCityZipCountry = qS('.cityZipCountry').value
}

// const allNumeric = (string) => {
//   for (let i = 0; i < string.length; i++) {
//     if
//   }
// }

const k2c = kelvin => {
  return kelvin - 273.15
}

const c2f = celsius => {
  return (celsius * 9) / 5 + 32
}

const k2f = kelvin => {
  return c2f(k2c(kelvin))
}

document.addEventListener('DOMContentLoaded', saveDefaults)
qS('.fetchWeatherButton').addEventListener('click', requestWeather)
qS('.cityZipCountry').addEventListener('focus', clearInput)
qS('.cityZipCountry').addEventListener('blur', reinsertInput)
