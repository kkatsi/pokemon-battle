import React, { useState, useRef } from "react";
import useBattleSequence from "../../hooks/useBattleSequence";
import { Move, Pokemon } from "../../types";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import Footer from "./Footer";
import HealthBar from "./HealthBar";

interface BattleScreenProps {
  you: Pokemon;
  enemy: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ you, enemy }) => {
  //  const enemyMove = useOpenAIResponse(1, you, enemy);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const youRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const { yourHealth, enemyHealth, text } = useBattleSequence({
    you,
    enemy,
    selectedMove,
    youElement: youRef.current,
    enemyElement: enemyRef.current,
  });

  return (
    <StyledBattleScreenContainer>
      <div className="you" ref={youRef}>
        <img src={you.sprites.battle_back} alt="" />
      </div>
      <HealthBar
        player="you"
        name={you.name}
        level={100}
        health={yourHealth}
        maxHealth={you.maxHealth}
      />
      <div className="enemy" ref={enemyRef}>
        <img src={enemy.sprites.battle_front} alt="" />
      </div>
      <HealthBar
        player="enemy"
        name={enemy.name}
        level={100}
        health={enemyHealth}
        maxHealth={enemy.maxHealth}
      />
      <Footer
        displayText={text}
        moveSet={you.moves ?? []}
        onMoveSelect={(move) => setSelectedMove(move)}
      />
    </StyledBattleScreenContainer>
  );
};
