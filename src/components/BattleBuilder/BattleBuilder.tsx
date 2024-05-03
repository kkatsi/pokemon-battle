import React, { useState } from "react";
import { StyledBattleBuilderContainer } from "./BattleBuilder.styled";
import { Pokemon } from "../../types";

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
        <img src={userSelection?.sprites.showcase} alt="" />
        <div className="pokemon-list"></div>
        <div className="hr"></div>
        <div className="pokemon-list"></div>
        <img src={enemySeletion?.sprites.showcase} alt="" />
      </div>
      <button
        onClick={() => onBattleStart(userSelection, enemySelection)}
        className="battle-button"
      >
        Battle now!
      </button>
    </StyledBattleBuilderContainer>
  );
};

export default BattleBuilder;
