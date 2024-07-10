import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as any[],
    selectedPokemon: null as any | null,
    isDataFetched: false,
  }),
  actions: {
    async fetchPokemons() {
      if (this.isDataFetched) {
        return
      }

      const response = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=151',
      )
      const pokemonList = response.data.results

      for (const pokemon of pokemonList) {
        const pokemonDetail = await axios.get(pokemon.url)
        this.pokemons.push(pokemonDetail.data)
      }

      this.isDataFetched = true
    },
    async fetchPokemonDetail(id: number) {
      if (this.selectedPokemon && this.selectedPokemon.id === id) {
        return
      }

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`,
      )
      this.selectedPokemon = response.data
    },
  },
})
