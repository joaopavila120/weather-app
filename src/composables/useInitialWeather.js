// src/composables/useInitialWeather.js
import { onMounted, ref } from 'vue'
import { useFallbackCities } from '@/composables/useFallbackCities'

/**
 * On mount, tries geolocation → current+forecast,
 * otherwise fallback to a random city.
 *
 * @param {Object} fetchers
 * @param {Function} fetchers.fetchCurrentByCoords
 * @param {Function} fetchers.fetchForecastByCoords
 * @param {Function} fetchers.fetchCurrentByCity
 * @param {Function} fetchers.fetchForecastByCity
 * @param {Function} transform - raw forecast → daily summary
 */
export function useInitialWeather(
  {
    fetchCurrentByCoords,
    fetchForecastByCoords,
    fetchCurrentByCity,
    fetchForecastByCity
  },
  transform
) {
  const weekly  = ref([])
  const { list: fallback, loadRandom } = useFallbackCities()

  onMounted(async () => {
    loadRandom()  // populate fallback list

    // if browser supports geolocation →
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // success
        async ({ coords }) => {
          await fetchCurrentByCoords(coords.latitude, coords.longitude)
          const raw = await fetchForecastByCoords(coords.latitude, coords.longitude)
          weekly.value = transform(raw)
        },
        // error → use first fallback city
        async () => {
          const city = fallback.value[0]
          const name = `${city.name},${city.country}`
          await fetchCurrentByCity(name)
          const raw = await fetchForecastByCity(name)
          weekly.value = transform(raw)
        }
      )
    } else {
      // no geolocation API → fallback
      const city = fallback.value[0]
      const name = `${city.name},${city.country}`
      await fetchCurrentByCity(name)
      const raw = await fetchForecastByCity(name)
      weekly.value = transform(raw)
    }
  })

  return { fallback, weekly }
}
