import React, { useState } from "react";
import useBattleSequence from "../../hooks/useBattleSequence";
import { Move, Pokemon } from "../../types";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import Footer from "./Footer";
import HealthBar from "./HealthBar";

interface BattleScreenProps {
  you: Pokemon;
  enemy: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  you: initialYou,
  enemy: initialEnemy,
}) => {
  //  const enemyMove = useOpenAIResponse(1, you, enemy);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const { you, enemy, text } = useBattleSequence({
    you: initialYou,
    enemy: initialEnemy,
    selectedMove,
  });

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
        displayText={text}
        moveSet={you.moves ?? []}
        onMoveSelect={(move) => setSelectedMove(move)}
      />
    </StyledBattleScreenContainer>
  );
};
