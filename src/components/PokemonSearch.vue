<template>
  <input
    v-model="searchQuery"
    @input="onSearch"
    placeholder="Search by name"
    class="p-inputtext p-component"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import debounce from 'lodash.debounce'

export default defineComponent({
  emits: ['update:search'],
  setup(props, { emit }) {
    const searchQuery = ref('')

    const onSearch = debounce(() => {
      emit('update:search', searchQuery.value)
    }, 300)

    return {
      searchQuery,
      onSearch,
    }
  },
})
</script>
