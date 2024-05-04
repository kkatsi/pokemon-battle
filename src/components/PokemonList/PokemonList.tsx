import React, { useRef } from "react";
import useGetPokemoNamesInfiniteQuery from "../../hooks/useGetPokemoNamesInfiniteQuery";
import { StyledPokemonListContainer } from "./PokemonList.styled";

interface PokemonListProps {
  player: "you" | "enemy";
  onPokemonSelection: (x: { name: string; url: string }) => void;
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
            <button onClick={() => onPokemonSelection(pokemonEntry)}>
              {pokemonEntry.name}
            </button>
          </li>
        ))}
      </ul>
    </StyledPokemonListContainer>
  );
};

export default PokemonList;
