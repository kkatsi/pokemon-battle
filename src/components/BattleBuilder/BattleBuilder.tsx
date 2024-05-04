import React, { useEffect, useState } from "react";
import { useGetPokemonNamesQuery } from "../../app/api";
import { Pokemon } from "../../types";
import { StyledBattleBuilderContainer } from "./BattleBuilder.styled";
import PokemonList from "../PokemonList";

interface BattleBuilderProps {
  onBattleStart: (userPokemonName: Pokemon, enemyPokemonName: Pokemon) => void;
}

const BattleBuilder: React.FC<BattleBuilderProps> = ({ onBattleStart }) => {
  const [userSelection, setUserSelection] = useState<Pokemon>();
  const [enemySeletion, setEnemySelection] = useState<Pokemon>();

  return (
    <StyledBattleBuilderContainer>
      <h1>Pokémon Battle</h1>
      <div className="container">
        <div className="showcase">
          <span>You</span>
          <img src={userSelection?.sprites.showcase} alt="" />
        </div>
        <PokemonList player="you" onPokemonSelection={setYourPokemon} />
        <div className="hr"></div>
        <PokemonList player="enemy" onPokemonSelection={setEnemyPokemon} />
        <div className="showcase">
          <span>Enemy</span>
          <img src={enemySeletion?.sprites.showcase} alt="" />
        </div>
      </div>
      <button
        onClick={() => {
          //   onBattleStart(userSelection, enemySelection);
        }}
        className="battle-button"
      >
        Battle now!
      </button>
    </StyledBattleBuilderContainer>
  );
};

export default BattleBuilder;
