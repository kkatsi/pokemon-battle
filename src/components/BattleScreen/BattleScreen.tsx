import React from "react";
import { Pokemon } from "../../types";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import Footer from "./Footer";
import HealthBar from "./HealthBar";

interface BattleScreenProps {
  you: Pokemon;
  enemy: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ you, enemy }) => {
  //  const enemyMove = useOpenAIResponse(1, you, enemy);

  return (
    <StyledBattleScreenContainer>
      <div className="you">
        <img src={you.sprites.battle_back} alt="" />
      </div>
      <HealthBar
        player="you"
        name={you.name}
        level={100}
        health={300}
        maxHealth={300}
      />
      <div className="enemy">
        <img src={enemy.sprites.battle_front} alt="" />
      </div>
      <HealthBar
        player="enemy"
        name={enemy.name}
        level={100}
        health={300}
        maxHealth={300}
      />
      <Footer
        displayText="Lugia used Flamethrower!"
        moveSet={you.moves ?? []}
        onMoveSelect={(move) => console.log(move)}
      />
    </StyledBattleScreenContainer>
  );
};
