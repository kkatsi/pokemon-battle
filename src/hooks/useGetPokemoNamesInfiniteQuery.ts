import { useState } from "react";
import { useGetPokemonNamesQuery } from "../app/api";

const useGetPokemoNamesInfiniteQuery = () => {
  const [nextPokemonsNames, setNextPokemonNames] = useState(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=50"
  );

  const { data: pokemonNames } = useGetPokemonNamesQuery(nextPokemonsNames);

  const fetchMore = () => {
    if (pokemonNames?.next) setNextPokemonNames(pokemonNames.next);
  };

  return { fetchMore, pokemonNames };
};

export default useGetPokemoNamesInfiniteQuery;
