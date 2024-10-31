import axios from "axios";

const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

type PaginationType = {
  page?: number;
  pageSize?: number;
};

class PokemonService {
  async getPokemons({ page = 1, pageSize = 12 }: PaginationType) {
    const res = await instance.get("/pokemon", {
      params: {
        offset: (page - 1) * pageSize,
        limit: pageSize,
      },
    });

    return res.data;
  }

  async getPokemonInfo({ id }: { id: string }) {
    const res = await instance.get(`/pokemon/${id}`);

    return res.data;
  }

  async getPokemonDescription({ name }: { name: string }) {
    const res = await instance.get(`/pokemon-species/${name}`);

    return res.data;
  }
}

const pokemonService = new PokemonService();

export default pokemonService;
