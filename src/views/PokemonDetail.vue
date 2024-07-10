<template>
  <div v-if="pokemon">
    <h1>{{ pokemon.name }}</h1>
    <img :alt="pokemon.name" :src="pokemon.sprites.front_shiny" />
    <p>ID: {{ pokemon.id }}</p>
    <p>Types: {{ formatTypes(pokemon) }}</p>
    <p>Height: {{ pokemon.height }} decimetres</p>
    <p>Weight: {{ pokemon.weight }} hectograms</p>
    <p>Abilities: {{ formatAbilities(pokemon) }}</p>
    <audio controls :src="pokemonCry"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { usePokemonStore } from '../store'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const store = usePokemonStore()
    const route = useRoute()
    const pokemonId = computed(() => Number(route.params.id))

    onMounted(() => {
      store.fetchPokemonDetail(pokemonId.value)
    })

    const pokemon = computed(() => store.selectedPokemon)

    const formatTypes = (pokemon) =>
      pokemon.types.map((type) => type.type.name).join(', ')
    const formatAbilities = (pokemon) =>
      pokemon.abilities.map((ability) => ability.ability.name).join(', ')
    const pokemonCry = computed(() =>
      pokemon.value
        ? `https://play.pokemonshowdown.com/audio/cries/${pokemon.value.name.toLowerCase()}.mp3`
        : '',
    )
    return {
      pokemon,
      formatTypes,
      formatAbilities,
      pokemonCry,
    }
  },
})
</script>
