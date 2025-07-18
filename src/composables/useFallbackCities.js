import { ref } from 'vue'
import {  getWeatherByCity,
  getForecastByCity,
  getWeatherByCoords,
  getForecastByCoords } from '../services/weatherService.js';



const ALL_CITIES = ['Lisbon','New York','Tokyo','Paris','Sydney','Moscow','Cairo','Rio de Janeiro']

export function useFallbackCities() {
  const list = ref([]) // 

  async function loadRandom() {
    const shuffled = ALL_CITIES.sort(() => Math.random() - 0.5)
    const pick = shuffled.slice(0,4)
    const promises = pick.map(name => getWeatherByCity(name))
    list.value = await Promise.all(promises)
  }

  return { list, loadRandom }
}
