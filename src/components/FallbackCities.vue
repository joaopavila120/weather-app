<template>
  <section v-if="cities.length" class="fallback">
    <h2>Explore other cities</h2>
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
const emit = defineEmits(['select'])
</script>

<style scoped>
.fallback { margin-top: 2rem; }
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
