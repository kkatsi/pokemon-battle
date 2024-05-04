import { skipToken } from "@reduxjs/toolkit/query";
import React, { useEffect, useState } from "react";
import { useGetPokemonByNameQuery } from "../../app/api";
import { StyledPokemonShowcaseContainer } from "./PokemonShowcase.styled";

interface PokemonShowcaseProps {
  player: "you" | "enemy";
  pokemonName?: string;
}

const PokemonShowcase: React.FC<PokemonShowcaseProps> = ({
  player,
  pokemonName,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { data: pokemon, isFetching: isPokemonFetching } =
    useGetPokemonByNameQuery(pokemonName ?? skipToken);

  const isLoading = isImageLoading || isPokemonFetching;

  useEffect(() => {
    if (pokemonName) setIsImageLoading(true);
  }, [pokemonName]);

  return (
    <StyledPokemonShowcaseContainer>
      <span>{player}</span>
      {isLoading && <div className="loader"></div>}
      <img
        src={pokemon?.sprites.battle_front}
        alt=""
        style={{ display: isLoading ? "none" : "block" }}
        onLoad={() => setIsImageLoading(false)}
      />
    </StyledPokemonShowcaseContainer>
  );
};

export default PokemonShowcase;
