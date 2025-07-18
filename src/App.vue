<template>
  <div class="container">
    <h1 class="title">Weather Dashboard</h1>

    <SearchBar @search="onSearch" />

    <div v-if="loading" class="status">Loading…</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <CurrentWeather :data="current" />
    <Forecast :data="forecast" />

    <div v-if="current && current.name">
      <button @click="showForecast = !showForecast" class="btn-toggle">
        {{ showForecast ? 'Hide' : 'Show next 5 days' }}
      </button>

      <transition-group name="fade" tag="div" class="forecast-grid">
        <DailyForecast
          v-for="(item, index) in showForecast ? weeklyForecast : []"
          :key="item.day"
          :forecast="[item]"
          :style="{ transitionDelay: `${index * 100}ms` }"
        />
      </transition-group>
    </div>

    <section v-if="fallback.length" class="fallback">
      <h2>Explore other cities</h2>
      <div class="city-grid">
        <CityCard
          v-for="c in fallback"
          :key="c.name"
          :data="c"
          @select="onSearch"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWeather } from './composables/useWeather'
import { useFallbackCities } from './composables/useFallbackCities'
import { useGeolocation } from './composables/useGeolocation'
import { getForecastByCity, getForecastByCoords } from './weatherService.js'

import SearchBar from './components/SearchBar.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import Forecast from './components/Forecast.vue'
import CityCard from './components/CityCard.vue'
import DailyForecast from './components/DailyForecast.vue'

const { current, forecast, loading, error, fetchByCity, fetchByCoords } = useWeather()
const { list: fallback, loadRandom } = useFallbackCities()

const showForecast = ref(false)
const weeklyForecast = ref([])

async function updateForecastByCity(city) {
  const raw = await getForecastByCity(city)
  weeklyForecast.value = transformForecast(raw)
}

async function updateForecastByCoords(lat, lon) {
  const raw = await getForecastByCoords(lat, lon)
  weeklyForecast.value = transformForecast(raw)
}

function transformForecast(raw) {
  const dailyMap = {}
  raw.list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0]
    if (!dailyMap[date]) dailyMap[date] = []
    dailyMap[date].push(entry)
  })

  const today = new Date().toISOString().split('T')[0]
  return Object.entries(dailyMap)
    .filter(([date]) => date > today)
    .slice(0, 5)
    .map(([date, entries]) => ({
      day: new Date(date).toLocaleDateString('eng', { weekday: 'long' }),
      description: entries[0].weather[0].description,
      tempMax: Math.round(Math.max(...entries.map(e => e.main.temp))),
      tempMin: Math.round(Math.min(...entries.map(e => e.main.temp))),
      icon: `https://openweathermap.org/img/wn/${entries[0].weather[0].icon}.png`
    }))
}

onMounted(() => {
  loadRandom()

  if (!navigator.geolocation) {
    // fallback imediato caso navegador não tenha geolocalização
    if (fallback.value.length) {
      fetchByCity(fallback.value[0].name)
      updateForecastByCity(fallback.value[0].name)
    }
    return
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords
      await fetchByCoords(latitude, longitude)
      await updateForecastByCoords(latitude, longitude)
    },
    async () => {
      if (fallback.value.length) {
        await fetchByCity(fallback.value[0].name)
        await updateForecastByCity(fallback.value[0].name)
      }
    }
  )
})

async function onSearch(payload) {
  if (typeof payload === 'string') {
    await fetchByCity(payload)
    await updateForecastByCity(payload)
  } else if (payload.name) {
    const cityName = `${payload.name},${payload.country}`
    await fetchByCity(cityName)
    await updateForecastByCity(cityName)
  } else if (payload.latitude && payload.longitude) {
    await fetchByCoords(payload.latitude, payload.longitude)
    await updateForecastByCoords(payload.latitude, payload.longitude)
  }
}
</script>

<style scoped>
.container { padding: 2rem; }
.title { text-align: center; margin-bottom: 2rem; }
.btn-toggle {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-toggle:hover { background-color: #e65c00; }
.status { margin-top: 1rem; color: #555; }
.status.error { color: red; }
.fallback { margin-top: 2rem; }
.city-grid, .forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
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
.fade-leave-to { opacity: 0; }
</style>
