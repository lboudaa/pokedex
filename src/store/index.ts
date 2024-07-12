// src/store/index.ts
import { defineStore } from 'pinia'
import { Pokemon } from '../types'

interface State {
  pokemons: Pokemon[]
  error: string | null
}

export const usePokemonStore = defineStore({
  id: 'pokemon',
  state: (): State => ({
    pokemons: [],
    error: null,
  }),
  actions: {
    async fetchPokemons() {
      if (this.pokemons.length > 0) {
        console.log('Using cached Pokémon data')
        return
      }

      try {
        console.log('Fetching Pokémon list...')
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=151',
        )
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon list')
        }

        const data = await response.json()
        console.log('Fetched Pokémon list:', data)

        const pokemonDetails = await Promise.all(
          data.results.map(
            async (pokemon: { name: string; url: string }, index: number) => {
              const detailResponse = await fetch(pokemon.url)
              if (!detailResponse.ok) {
                throw new Error(`Failed to fetch details for ${pokemon.name}`)
              }
              const detailData = await detailResponse.json()

              return {
                id: index + 1,
                name: detailData.name,
                type: detailData.types.map(
                  (typeInfo: { type: { name: string } }) => typeInfo.type.name,
                ),
                height: detailData.height,
                weight: detailData.weight,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                cry: `https://play.pokemonshowdown.com/audio/cries/${detailData.name}.mp3`,
                abilities: detailData.abilities.map(
                  (abilityInfo: { ability: { name: string } }) =>
                    abilityInfo.ability.name,
                ),
              }
            },
          ),
        )

        console.log('Fetched Pokémon details:', pokemonDetails)

        this.pokemons = pokemonDetails
        this.error = null // Clear any previous errors
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch Pokémon data:', error)
      }
    },
  },
})
