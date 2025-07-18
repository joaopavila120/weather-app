<template>
  <div class="container">
    <h1 class="title">Weather Dashboard</h1>

    <SearchBar @search="onSearch" />

    <div v-if="loading || loadingSearch" class="status">Loading…</div>
    <div v-if="error"               class="status error">{{ error }}</div>

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
import { useSearch }             from '@/composables/useSearch'
import { getForecastByCity, getForecastByCoords } from '@/weatherService.js'

import SearchBar        from '@/components/SearchBar.vue'
import CurrentWeather   from '@/components/CurrentWeather.vue'
import ForecastSection  from '@/components/ForecastSection.vue'
import FallbackCities   from '@/components/FallbackCities.vue'

/** Hook current/forecast */
const {
  current,
  forecast,
  loading,
  error,
  fetchByCity,
  fetchByCoords
} = useWeather()

/** Hook */
const { transform } = useForecastTransform()

/** Hook (geo + fallback) */
const { fallback, weekly, reloadFallback } = useInitialWeather(
  {
    fetchCurrentByCoords:  fetchByCoords,
    fetchForecastByCoords: getForecastByCoords,

    fetchCurrentByCity:    fetchByCity,
    fetchForecastByCity:   getForecastByCity
  },
  transform
)

/** Hook + scroll */
const { onSearch, loadingSearch } = useSearch(
  { fetchByCity, fetchByCoords },
  transform,
  weekly
)

/** Shuffle (udate icon) suggested cities */
async function shuffleCities() {
  await reloadFallback()
}
</script>

<style scoped>
.container { padding: 2rem; }
.title     { text-align: center; margin-bottom: 2rem; }
.status     { margin-top: 1rem; color: #555; }
.status.error { color: red; }

/* fade transition (mantido) */
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
