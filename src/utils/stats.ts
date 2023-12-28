import { AnyAction } from "@reduxjs/toolkit";
import { pokemonApi } from "../app/api";

export const adjustPokemonStat = (
  pokemonName: string,
  statName: string,
  adjustmentPercentage: number
) =>
  pokemonApi.util.updateQueryData(
    "getPokemonByName",
    pokemonName.toLowerCase(),
    (draft) => {
      const patch = {
        ...draft,
        stats: {
          ...draft.stats,
          [statName]: draft.stats[statName] * adjustmentPercentage,
        },
      };
      Object.assign(draft, patch);
    }
  ) as unknown as AnyAction;
