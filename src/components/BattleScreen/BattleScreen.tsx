import React, { useRef, useState } from "react";
import useBattleSequence from "../../hooks/useBattleSequence";
import { Move, Pokemon } from "../../types";
import { minmaxMoveDecision } from "../../utils/moves";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import Footer from "./Footer";
import HealthBar from "./HealthBar";

interface BattleScreenProps {
  you: Pokemon;
  enemy: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ you, enemy }) => {
  const [enemyMove, setEnemyMove] = useState(
    minmaxMoveDecision(enemy.moves ?? [], enemy, you)
  );
  const [yourMove, setYourMove] = useState<Move | null>(null);
  const youRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const {
    yourHealth,
    enemyHealth,
    yourSideEffect,
    enemySideEffect,
    text,
    isTurnInProgress,
    isBattleEnd,
  } = useBattleSequence({
    you,
    enemy,
    setEnemyMove,
    yourMove,
    setYourMove,
    enemyMove,
    youElement: youRef.current,
    enemyElement: enemyRef.current,
  });

  return (
    <StyledBattleScreenContainer>
      <div className={`you ${you.name}`} id="you" ref={youRef}>
        <img src={you.sprites.battle_back} alt="" />
      </div>
      <HealthBar
        player="you"
        name={you.name}
        level={100}
        health={yourHealth}
        maxHealth={you.maxHealth}
        sideEffect={yourSideEffect?.name}
      />
      <div className={`enemy ${enemy.name}`} id="enemy" ref={enemyRef}>
        <img src={enemy.sprites.battle_front} alt="" />
      </div>
      <HealthBar
        player="enemy"
        name={enemy.name}
        level={100}
        health={enemyHealth}
        maxHealth={enemy.maxHealth}
        sideEffect={enemySideEffect?.name}
      />
      <Footer
        disabled={isTurnInProgress || isBattleEnd}
        displayText={text}
        moveSet={you.moves ?? []}
        onMoveSelect={(move) => setYourMove(move)}
      />
    </StyledBattleScreenContainer>
  );
};
