import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetPokemonByNameQuery,
  useGetPokemonMovesetByNameQuery,
} from "../app/api";
import { Pokemon } from "../types";

const useGetSelectedPokemons = () => {
  const query = new URLSearchParams(location.search);
  const user = query.get("user");
  const enemy = query.get("enemy");

  const { data: userPokemonWithoutMoves } = useGetPokemonByNameQuery(
    user ?? skipToken
  );
  const { data: enemyPokemonWithoutMoves } = useGetPokemonByNameQuery(
    enemy ?? skipToken
  );

  const { data: userPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    userPokemonWithoutMoves
      ? {
          name: userPokemonWithoutMoves.name,
          moves: userPokemonWithoutMoves.moveNames,
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

  const userPokemon = userPokemonMoveset
    ? ({
        ...userPokemonWithoutMoves,
        moves: userPokemonMoveset,
      } as Pokemon)
    : userPokemonWithoutMoves;
  const enemyPokemon = enemyPokemonMoveset
    ? ({
        ...enemyPokemonWithoutMoves,
        moves: enemyPokemonMoveset,
      } as Pokemon)
    : enemyPokemonWithoutMoves;

  return {
    userPokemon,
    enemyPokemon,
  };
};

export default useGetSelectedPokemons;
