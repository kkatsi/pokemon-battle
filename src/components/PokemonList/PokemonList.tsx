import React, { useRef } from "react";
import useGetPokemoNamesInfiniteQuery from "../../hooks/useGetPokemoNamesInfiniteQuery";
import { StyledPokemonListContainer } from "./PokemonList.styled";
import { updateQueryStringParam } from "../../utils/helper";

interface PokemonListProps {
  player: "you" | "enemy";
  onPokemonSelection: (x: string) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  player,
  onPokemonSelection,
}) => {
  const { pokemonNames, fetchMore } = useGetPokemoNamesInfiniteQuery();

  const observer = useRef<IntersectionObserver>();

  const triggerElementRef = (element: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchMore();
    });

    if (element) observer.current.observe(element);
  };

  const handlePokemonSelection = async (pokemonName: string) => {
    onPokemonSelection(pokemonName);
    updateQueryStringParam(player, pokemonName);
  };

  return (
    <StyledPokemonListContainer>
      <ul>
        {pokemonNames?.results.map((pokemonEntry, index) => (
          <li
            key={`${player}-${pokemonEntry.name}`}
            ref={
              index === pokemonNames.results.length - 10
                ? triggerElementRef
                : undefined
            }
          >
            <button onClick={() => handlePokemonSelection(pokemonEntry.name)}>
              {pokemonEntry.name}
            </button>
          </li>
        ))}
      </ul>
    </StyledPokemonListContainer>
  );
};

export default PokemonList;
