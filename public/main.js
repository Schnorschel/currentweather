const qS = e => document.querySelector(e)
const apiURL = 'https://api.openweathermap.org/data/2.5/weather'
const appid = 'a9912898d642cb04a000d534b4f8653a'
let geolocationSupported
let lat
let lon

let defaultCityZipCountry

const fetchLocation = async () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser')
    geolocationSupported = false
    return
  } else {
    console.log('Geolocation is supported by your browser')
    geolocationSupported = true
  }
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

const geoError = () => {
  writeToNewPInContainer(
    'An error occurred attempting to retrieve your location'
  )
}
const geoSuccess = position => {
  lat = position.coords.latitude
  lon = position.coords.longitude
  console.log('Location: ' + lat + ', ' + lon)
  fetchWeather([lat, lon], 'latlon')
}

const fetchWeather = async (cityZipCountryLonglat, type) => {
  console.log('Location: ' + cityZipCountryLonglat)
  let apiCall = apiURL + '?appid=' + appid
  if (typeof type === 'undefined') {
    type = 'cityzip'
  } else if (type === '') {
    type = 'cityzip'
  }
  if (type === 'cityzip') {
    apiCall += '&q=' + cityZipCountryLonglat
  } else if (type === 'latlon') {
    apiCall +=
      '&lat=' + cityZipCountryLonglat[0] + '&lon=' + cityZipCountryLonglat[1]
  }
  console.log('API-call: ' + apiCall)
  const resp = await fetch(apiCall)
  console.log('resp.status: ' + resp.status)
  if (resp.status !== 200) {
    writeToNewPInContainer(
      'Error retrieving weather data for ' + cityZipCountryLonglat
    )
    return
  }
  const weather = await resp.json()
  // qS('.responseContainer').textContent
  const weatherString =
    weather.name +
    ': ' +
    weather.weather[0].main +
    ', ' +
    k2c(parseFloat(weather.main.temp)).toFixed(1) +
    '°C (' +
    k2f(parseFloat(weather.main.temp)).toFixed(1) +
    '°F)'
  writeToNewPInContainer(weatherString)
}

const writeToNewPInContainer = (text, container) => {
  if (typeof container === 'undefined') {
    container = '.responseContainer'
  }
  const newP = document.createElement('p')
  newP.textContent = text

  // const newImg = document.createElement('img')
  // newImg.src = 'http://openweathermap.org/img/wn/10d@2x.png'

  // newP.appendChild(newImg)
  qS(container).insertBefore(newP, qS(container).firstChild)
}

const requestWeather = () => {
  let cityZipCountry = qS('.cityZipCountry').value

  if (cityZipCountry === '' || cityZipCountry === defaultCityZipCountry) {
    window.alert('Please provide a valid city name or US zip-code.')
    return
  }
  if (typeof Storage !== 'undefined') {
    window.localStorage.setItem('user_location_search', cityZipCountry)
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

const main = () => {
  defaultCityZipCountry = qS('.cityZipCountry').value // save the default value of input field
  fetchLocation()
  if (typeof Storage !== 'undefined') {
    const lastSearch = window.localStorage.getItem('user_location_search')
    if (lastSearch !== null) {
      fetchWeather(lastSearch)
    }
  }
  // fetchWeather('', !isNaN(lon) ? 'latlon' : '')
}

const k2c = kelvin => {
  return kelvin - 273.15
}

const c2f = celsius => {
  return (celsius * 9) / 5 + 32
}

const k2f = kelvin => {
  return c2f(k2c(kelvin))
}

document.addEventListener('DOMContentLoaded', main)
qS('.fetchWeatherButton').addEventListener('click', requestWeather)
qS('.cityZipCountry').addEventListener('focus', clearInput)
qS('.cityZipCountry').addEventListener('blur', reinsertInput)
