import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetPokemonByNameQuery,
  useGetPokemonMovesetByNameQuery,
} from "../app/api";
import { Pokemon } from "../types";

const useGetSelectedPokemons = () => {
  const query = new URLSearchParams(location.search);
  const you = query.get("you");
  const enemy = query.get("enemy");

  const { data: yourPokemonWithoutMoves } = useGetPokemonByNameQuery(
    you ?? skipToken
  );
  const { data: enemyPokemonWithoutMoves } = useGetPokemonByNameQuery(
    enemy ?? skipToken
  );

  const { data: yourPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    yourPokemonWithoutMoves
      ? {
          name: yourPokemonWithoutMoves.name,
          moves: yourPokemonWithoutMoves.moveNames,
        }
      : skipToken
  );
  const { data: enemyPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    enemyPokemonWithoutMoves
      ? {
          name: enemyPokemonWithoutMoves.name,
          moves: enemyPokemonWithoutMoves.moveNames,
        }
      : skipToken
  );

  const yourPokemon = yourPokemonMoveset
    ? ({
        ...yourPokemonWithoutMoves,
        moves: yourPokemonMoveset,
      } as Pokemon)
    : yourPokemonWithoutMoves;
  const enemyPokemon = enemyPokemonMoveset
    ? ({
        ...enemyPokemonWithoutMoves,
        moves: enemyPokemonMoveset,
      } as Pokemon)
    : enemyPokemonWithoutMoves;

  return {
    yourPokemon,
    enemyPokemon,
  };
};

export default useGetSelectedPokemons;
