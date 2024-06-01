import React, { ChangeEvent, useState } from "react";
import useGetPokemonNames from "../../hooks/useGetPokemonNames";
import { Player } from "../../types";
import { updateQueryStringParam } from "../../utils/helper";
import { StyledPokemonListContainer } from "./PokemonList.styled";

interface PokemonListProps {
  alreadySelectedPokemon?: { player: Player; pokemonName?: string };
  player: Player;
  onPokemonSelection: (x: string) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  player,
  onPokemonSelection,
  alreadySelectedPokemon,
}) => {
  const { pokemonNames, search } = useGetPokemonNames();
  const [selectedPokemonName, setSelectedPokemonName] = useState("");

  const handlePokemonSelection = async (pokemonName: string) => {
    onPokemonSelection(pokemonName);
    setSelectedPokemonName(pokemonName);
    updateQueryStringParam(player, pokemonName);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    search(value);
  };

  return (
    <StyledPokemonListContainer>
      <input type="text" placeholder="Search..." onChange={handleInputChange} />
      <ul>
        {pokemonNames?.map((pokemonEntry) => (
          <li
            className={`${
              pokemonEntry.name === selectedPokemonName ? "active" : ""
            } ${player}`}
            key={`${player}-${pokemonEntry.name}`}
          >
            <button
              disabled={
                alreadySelectedPokemon?.pokemonName === pokemonEntry.name &&
                player !== alreadySelectedPokemon?.player
              }
              onClick={() => handlePokemonSelection(pokemonEntry.name)}
            >
              {pokemonEntry.name}
            </button>
          </li>
        ))}
      </ul>
    </StyledPokemonListContainer>
  );
};

export default PokemonList;
