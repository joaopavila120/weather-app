import axios from 'axios'

const KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

// search city by name
export async function getWeatherByCity(city) {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

export async function getForecastByCity(city) {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&cnt=5&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

// search by coordinates
export async function getWeatherByCoords(lat, lon) {
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

export async function getForecastByCoords(lat, lon) {
  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

// city autocomplete
// src/services/weatherService.js
export async function searchCities(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct` +
              `?q=${encodeURIComponent(query)}` +
              `&limit=5&appid=${KEY}`
  const { data } = await axios.get(url)

  // Exact filter for the city names (name 1:1, without case‑sensitivity)
  const exact = data.filter(
    item => item.name.toLowerCase() === query.toLowerCase()
  )

  //  if its correct, returns the exact name
  if (exact.length) {
    return exact
  }

  // if not, return it back 5 close names
  return data
}

