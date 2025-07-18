<template>
  <section v-if="cities.length" class="fallback">
    <div class="fallback-header">
      <h2>Explore other cities</h2>
        <!-- SVG button -->
      <button
        @click="shuffleCities"
        class="btn-shuffle"
        aria-label="Shuffle cities"
        title="Shuffle cities"
      >
🔄
       

      </button>
    </div>

    <div class="city-grid">
      <CityCard
        v-for="c in cities"
        :key="c.name"
        :data="c"
        @select="$emit('select', c)"
      />
    </div>
  </section>
</template>

<script setup>
import CityCard from '@/components/CityCard.vue'

const props = defineProps({
  cities: { type: Array, required: true }
})
const emit = defineEmits(['select', 'shuffle'])

function shuffleCities() {
  emit('shuffle')
}
</script>

<style scoped>
.fallback-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.btn-shuffle {
  font-size: 1.4em;     
  background: none;
  border: none;
  cursor: pointer;
}


.btn-shuffle svg {
  width: 1.4em;
  height: 1.4em;
  transition: transform 0.3s ease;
}

.btn-shuffle:hover svg {
  transform: rotate(90deg);
}

/* grid de cidades */
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
