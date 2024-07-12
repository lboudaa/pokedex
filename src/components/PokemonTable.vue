<template>
  <DataTable
    :value="paginatedPokemons"
    paginator
    :rows="rows"
    :totalRecords="filteredPokemons.length"
    @page="onPage"
  >
    <Column field="image" header="Image" :body="formatImage"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="type" header="Type"></Column>
    <Column field="base_experience" header="Base Experience"></Column>
    <Column field="weight" header="Weight"></Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import Column from 'primevue/datatable'
import DataTable from 'primevue/datatable'

export default defineComponent({
  components: { DataTable, Column },
  props: {
    pokemons: Array,
    searchQuery: String,
    selectedType: { name: String },
  },
  setup(props) {
    const page = ref(0)
    const rows = ref(10)

    const filteredPokemons = computed(() => {
      return props.pokemons.filter((pokemon) => {
        return (
          pokemon.name
            .toLowerCase()
            .includes(props.searchQuery.toLowerCase()) &&
          (props.selectedType === 'All' ||
            props.selectedType === null ||
            pokemon.types[0].type.name.includes(props.selectedType))
        )
      })
    })

    const paginatedPokemons = computed(() => {
      const start = page.value * rows.value
      return filteredPokemons.value.slice(start, start + rows.value)
    })

    const formatImage = (pokemon) => {
      return `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />`
    }

    const onPage = (event) => {
      page.value = event.page
    }

    watch(filteredPokemons, () => {
      page.value = 0
    })

    return {
      paginatedPokemons,
      rows,
      filteredPokemons,
      formatImage,
      onPage,
    }
  },
})
</script>
