import React, { useState } from "react";
import { Player } from "../../types";
import PokemonList from "../PokemonList";
import PokemonShowcase from "../PokemonShowcase";
import { StyledBattleBuilderContainer } from "./BattleBuilder.styled";

interface BattleBuilderProps {
  onBattleStart: (userPokemonName: string, enemyPokemonName: string) => void;
}

const BattleBuilder: React.FC<BattleBuilderProps> = ({ onBattleStart }) => {
  const [userSelectedPokemonName, setUserSelectedPokemonName] =
    useState<string>();
  const [enemySelectedPokemonName, setEnemySelectedPokemonName] =
    useState<string>();

  return (
    <StyledBattleBuilderContainer>
      <h1>Pokémon Battle</h1>
      <div className="container">
        <PokemonShowcase
          player={Player.User}
          pokemonName={userSelectedPokemonName}
        />
        <PokemonList
          alreadySelectedPokemon={{
            player: Player.Enemy,
            pokemonName: enemySelectedPokemonName,
          }}
          player={Player.User}
          onPokemonSelection={setUserSelectedPokemonName}
        />
        <div className="hr"></div>
        <PokemonList
          alreadySelectedPokemon={{
            player: Player.User,
            pokemonName: userSelectedPokemonName,
          }}
          player={Player.Enemy}
          onPokemonSelection={setEnemySelectedPokemonName}
        />
        <PokemonShowcase
          player={Player.Enemy}
          pokemonName={enemySelectedPokemonName}
        />
      </div>
      <button
        disabled={!userSelectedPokemonName || !enemySelectedPokemonName}
        onClick={() => {
          if (userSelectedPokemonName && enemySelectedPokemonName) {
            onBattleStart(userSelectedPokemonName, enemySelectedPokemonName);
          }
        }}
        className="battle-button"
      >
        Battle now!
      </button>
    </StyledBattleBuilderContainer>
  );
};

export default BattleBuilder;
