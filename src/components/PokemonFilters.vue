<template>
  <Select
    v-model="selectedType"
    :options="types"
    optionLabel="name"
    placeholder="Select Type"
    @change="onFilter"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Select from 'primevue/select'

export default defineComponent({
  components: { Select },
  emits: ['update:filter'],
  setup(props, { emit }) {
    const types = ref([
      { name: 'All' },
      { name: 'Bug' },
      { name: 'Dark' }, // Included in case we ever decide to support alolan forms
      { name: 'Dragon' },
      { name: 'Electric' },
      { name: 'Fairy' },
      { name: 'Fighting' },
      { name: 'Fire' },
      { name: 'Flying' },
      { name: 'Ghost' },
      { name: 'Grass' },
      { name: 'Ground' },
      { name: 'Ice' },
      { name: 'Normal' },
      { name: 'Psychic' },
      { name: 'Poison' },
      { name: 'Rock' },
      { name: 'Steel' },
      { name: 'Water' },
    ])
    const selectedType = ref(null)

    const onFilter = () => {
      emit('update:filter', selectedType.value)
    }

    return {
      types,
      selectedType,
      onFilter,
    }
  },
})
</script>
