<template>
  <div class="container">
    <h1 class="title">Weather Dashboard</h1>

    <SearchBar @search="onSearch" />

    <!--status -->
    <div v-if="loading" class="status">Loading…</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <!--current weather-->
    <CurrentWeather :data="current" />

    <!-- forecast by hours -->
    <Forecast :data="forecast" />

    <!-- five days forecast blocks -->
    <div v-if="current && current.name">
      <button @click="showForecast = !showForecast" class="btn-toggle">
        {{ showForecast ? 'Hide' : 'Show' }} forecast for the next 5 days
      </button>

      <transition name="fade">
    <DailyForecast
  v-if="showForecast && current && current.name"
  :forecast="weeklyForecast"
/>
      </transition>
    </div>

    <!-- suggest cities -->
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

import SearchBar from './components/SearchBar.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import Forecast from './components/Forecast.vue'
import CityCard from './components/CityCard.vue'
import DailyForecast from './components/DailyForecast.vue'

//
const { current, forecast, loading, error, fetchByCity, fetchByCoords } = useWeather()
const { list: fallback, loadRandom } = useFallbackCities()

// 🌞 Estado da previsão estendida
const showForecast = ref(false)
const weeklyForecast = ref([])

// 🔁 Carrega sugestões + mock da previsão estendida
onMounted(() => {
  loadRandom()

  weeklyForecast.value = [
    {
      day: 'Amanhã',
      description: 'Parcialmente nublado',
      tempMax: 26,
      tempMin: 19,
      icon: 'https://openweathermap.org/img/wn/03d.png'
    },
    {
      day: 'Sexta',
      description: 'Chuva leve',
      tempMax: 23,
      tempMin: 17,
      icon: 'https://openweathermap.org/img/wn/10d.png'
    },
    {
      day: 'Sábado',
      description: 'Céu limpo',
      tempMax: 25,
      tempMin: 18,
      icon: 'https://openweathermap.org/img/wn/01d.png'
    },
    {
      day: 'Domingo',
      description: 'Parcialmente nublado',
      tempMax: 27,
      tempMin: 20,
      icon: 'https://openweathermap.org/img/wn/03d.png'
    },
    {
      day: 'Segunda',
      description: 'Nublado',
      tempMax: 22,
      tempMin: 16,
      icon: 'https://openweathermap.org/img/wn/04d.png'
    }
  ]
})

// geolocation
useGeolocation(
  coords => {
    fetchByCoords(coords.latitude, coords.longitude)
  },
  () => {
    if (fallback.value.length) {
      fetchByCity(fallback.value[0].name)
    }
  }
)

// search event
function onSearch(payload) {
  if (typeof payload === 'string') {
    fetchByCity(payload)
    return
  }

  if (payload.name) {
    const cityName = `${payload.name},${payload.country}`
    fetchByCity(cityName)
    return
  }

  if (payload.latitude && payload.longitude) {
    fetchByCoords(payload.latitude, payload.longitude)
  }
}
</script>

<style scoped>
.btn-toggle {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-toggle:hover {
  background-color: #e65c00;
}
.status {
  margin-top: 1rem;
  color: #555;
}
.status.error {
  color: red;
}
.fallback {
  margin-top: 2rem;
}
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

/* 🌫️ Animação fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
