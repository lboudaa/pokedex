<template>
  <div>
    <div class="filters">
      <input v-model="searchQuery" placeholder="Search by name" />
      <select v-model="filterType">
        <option value="">Filter by type</option>
        <option v-for="type in uniqueTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>
    <DataTable
      :sortField="sortField"
      :sortOrder="sortOrder"
      :value="paginatedPokemons"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      stripedRows
      tableStyle="min-width: 75rem"
      @sort="onSort"
      @row-click="goToPokemonDetail"
    >
      <Column>
        <template #body="slotProps">
          <img
            height="50"
            width="50"
            :alt="name"
            :src="slotProps.data.sprites.front_default"
          />
        </template>
      </Column>
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Name" sortable> </Column>
      <Column :body="formatTypes" field="types" header="Types" sortable>
        <template #body="slotProps">
          {{ formatTypes(slotProps.data) }}
        </template>
      </Column>
      <Column field="height" header="Height (dm)" sortable></Column>
      <Column field="weight" header="Weight (hg)" sortable></Column>
      <Column :body="formatAbilities" field="abilities" header="Abilities">
        <template #body="slotProps">
          {{ formatAbilities(slotProps.data) }}
        </template>
      </Column>
    </DataTable>
    <div class="pagination">
      <Button :disabled="currentPage === 1" @click="prevPage">Previous</Button>
      <Button :disabled="currentPage === totalPages" @click="nextPage"
        >Next</Button
      >
    </div>
    <p>Total weight: {{ totalWeight }} hg</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { usePokemonStore } from '../store'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
  },
  setup() {
    const store = usePokemonStore()
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const searchQuery = ref('')
    const filterType = ref('')
    const sortField = ref('')
    const sortOrder = ref(1)

    onMounted(async () => {
      await store.fetchPokemons()
      loading.value = false
    })

    const currentPage = computed(() => Number(route.query.page) || 1)
    const filteredAndSortedPokemons = computed(() => {
      let pokemons = store.pokemons

      if (searchQuery.value) {
        pokemons = pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
      }

      if (filterType.value) {
        pokemons = pokemons.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name === filterType.value),
        )
      }

      if (sortField.value) {
        pokemons = [...pokemons].sort((a, b) => {
          if (a[sortField.value] < b[sortField.value])
            return sortOrder.value === 1 ? -1 : 1
          if (a[sortField.value] > b[sortField.value])
            return sortOrder.value === 1 ? 1 : -1
          return 0
        })
      }

      return pokemons
    })
    const paginatedPokemons = computed(() => {
      const start = (currentPage.value - 1) * 10
      return filteredAndSortedPokemons.value.slice(start, start + 10)
    })

    const goToPokemonDetail = (event) => {
      router.push({ name: 'PokemonDetail', params: { id: event.data.id } })
    }

    const totalPages = computed(() =>
      Math.ceil(filteredAndSortedPokemons.value.length / 10),
    )
    const totalWeight = computed(() => {
      return paginatedPokemons.value.reduce(
        (sum, pokemon) => sum + pokemon.weight,
        0,
      )
    })

    const prevPage = () => {
      if (currentPage.value > 1) {
        router.push({ query: { page: currentPage.value - 1 } })
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        router.push({ query: { page: currentPage.value + 1 } })
      }
    }

    const onSort = (event) => {
      sortField.value = event.sortField
      sortOrder.value = event.sortOrder
      currentPage.value = 1
    }

    const uniqueTypes = computed(() => {
      const types = new Set()
      store.pokemons.forEach((pokemon) => {
        pokemon.types.forEach((type) => types.add(type.type.name))
      })
      return Array.from(types)
    })

    const formatTypes = (pokemon) =>
      pokemon.types.map((type) => type.type.name).join('/')
    const formatAbilities = (pokemon) =>
      pokemon.abilities.map((ability) => ability.ability.name).join(', ')
    const formatImage = (pokemon) =>
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />`
    return {
      paginatedPokemons,
      currentPage,
      totalPages,
      totalWeight,
      prevPage,
      nextPage,
      formatTypes,
      formatAbilities,
      loading,
      searchQuery,
      filterType,
      onSort,
      uniqueTypes,
      sortField,
      sortOrder,
      goToPokemonDetail,
      formatImage,
    }
  },
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
