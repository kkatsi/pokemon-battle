import React from "react";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import { Pokemon } from "../../types";
import Footer from "./Footer";

interface BattleScreenProps {
  you?: Pokemon;
  enemy?: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ you, enemy }) => {
  return (
    <StyledBattleScreenContainer>
      <div className="you">
        <img src={you?.sprites.battle_back} alt="" />
      </div>
      <div className="enemy">
        <img src={enemy?.sprites.battle_front} alt="" />
      </div>
      <Footer
        displayText="Lugia used Flamethrower!"
        onMoveSelect={(move) => console.log(move)}
      />
    </StyledBattleScreenContainer>
  );
};
