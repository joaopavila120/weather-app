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
  // ALTERAÇÃO: Removido o '&cnt=5' para obter a previsão completa
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${KEY}`
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
  // ALTERAÇÃO: Removido o '&cnt=5' para obter a previsão completa
  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

// city autocomplete
export async function searchCities(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${KEY}`
  const { data } = await axios.get(url)

  const uniqueCities = []
  const citySet = new Set()

  data.forEach(item => {
    const cityKey = `${item.name},${item.country}`
    if (!citySet.has(cityKey)) {
      uniqueCities.push(item)
      citySet.add(cityKey)
    }
  })

  return uniqueCities
}