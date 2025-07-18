import axios from 'axios'
const KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

// Busca cidade pelo nome
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

// Busca clima por coordenadas
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

// Autocomplete de cidades (Geocoding API)
export async function searchCities(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${KEY}`
  const { data } = await axios.get(url)
  // retorna lista de objetos { name, country, lat, lon }
  return data
}

