<template>
  <div>
    <PokemonSearch @update:search="updateSearch" />
    <PokemonFilters @update:filter="updateFilter" />
    <PokemonTable
      :pokemons="pokemons"
      :searchQuery="searchQuery"
      :selectedType="selectedType"
    />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import PokemonSearch from '../components/PokemonSearch.vue'
import PokemonFilters from '../components/PokemonFilters.vue'
import PokemonTable from '../components/PokemonTable.vue'
import { usePokemonStore } from '../store'
import { Pokemon } from '../types'

export default defineComponent({
  components: { PokemonSearch, PokemonFilters, PokemonTable },
  setup() {
    const store = usePokemonStore()
    const searchQuery = ref('')
    const selectedType = ref<string | null>(null)

    const updateSearch = (query: string) => {
      searchQuery.value = query
    }

    const updateFilter = (type: string) => {
      selectedType.value = type
    }

    onMounted(() => {
      store.fetchPokemons().then(() => {
        console.log('Pokémon fetched:', store.pokemons)
      })
    })

    const pokemons = computed(() => store.pokemons)

    watch(
      () => store.pokemons,
      (newVal) => {
        console.log('Store pokemons updated:', newVal)
      },
    )

    return {
      pokemons,
      searchQuery,
      selectedType,
      updateSearch,
      updateFilter,
      error: store.error,
    }
  },
})
</script>

<style>
.error {
  color: red;
}
</style>
