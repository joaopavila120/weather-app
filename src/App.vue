<template>
  <div class="container">
    <h1 class="title">Weather Dashboard</h1>

    <SearchBar @search="onSearch" />

    <div v-if="loading" class="status">Loading…</div>
    <div v-if="error"   class="status error">{{ error }}</div>

    <CurrentWeather :data="current" />

    <ForecastSection
      :forecast="forecast"
      :weekly="weekly"
    />

    <FallbackCities
      :cities="fallback"
      @select="onSearch"
      @shuffle="shuffleCities"
    />
  </div>
</template>

<script setup>
import { useWeather }            from '@/composables/useWeather'
import { useForecastTransform }  from '@/composables/useForecastTransform'
import { useInitialWeather }     from '@/composables/useInitialWeather'
import { getForecastByCity, getForecastByCoords } from '@/weatherService.js'

import SearchBar        from '@/components/SearchBar.vue'
import CurrentWeather   from '@/components/CurrentWeather.vue'
import ForecastSection  from '@/components/ForecastSection.vue'
import FallbackCities   from '@/components/FallbackCities.vue'

/** hook - fetch */
const {
  current,
  forecast,
  loading,
  error,
  fetchByCity,
  fetchByCoords
} = useWeather()

/** hook  */
const { transform } = useForecastTransform()

/** hook  */
const { fallback, weekly, reloadFallback } = useInitialWeather(
  {
    fetchCurrentByCoords: fetchByCoords,
    fetchForecastByCoords: getForecastByCoords,
    fetchCurrentByCity:    fetchByCity,
    fetchForecastByCity:   getForecastByCity
  },
  transform
)

/** shuffle city (update button) */
async function shuffleCities() {
  await reloadFallback()
}

/** handler unificado de busca: city string | city obj | coords obj */
async function onSearch(payload) {

    window.scrollTo({ top: 0, behavior: 'smooth' })
  if (typeof payload === 'string') {
    await fetchByCity(payload)
    const raw = await getForecastByCity(payload)
    weekly.value = transform(raw)

  } else if (payload.name) {
    const name = `${payload.name},${payload.country}`
    await fetchByCity(name)
    const raw = await getForecastByCity(name)
    weekly.value = transform(raw)

  } else if (payload.latitude && payload.longitude) {
    await fetchByCoords(payload.latitude, payload.longitude)
    const raw = await getForecastByCoords(payload.latitude, payload.longitude)
    weekly.value = transform(raw)
  }


}
</script>

<style scoped>
.container { padding: 2rem; }
.title     { text-align: center; margin-bottom: 2rem; }
.status     { margin-top: 1rem; color: #555; }
.status.error { color: red; }

/* fade transition (kept)) */
.fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
