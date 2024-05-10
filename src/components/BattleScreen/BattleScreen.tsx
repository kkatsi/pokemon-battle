import React, { useEffect, useRef, useState } from "react";
import useBattleSequence from "../../hooks/useBattleSequence";
import { Move, Pokemon } from "../../types";
import { minmaxMoveDecision } from "../../utils/moves";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import Footer from "./Footer";
import HealthBar from "./HealthBar";

interface BattleScreenProps {
  onBattleEnd: () => void;
  user: Pokemon;
  enemy: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  onBattleEnd,
  user,
  enemy,
}) => {
  const [enemyMove, setEnemyMove] = useState<Move | undefined>(
    minmaxMoveDecision(enemy.moves ?? [], enemy, user)
  );
  const [yourMove, setUserrMove] = useState<Move>();
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
    closeModal,
  } = useBattleSequence({
    user,
    enemy,
    setEnemyMove,
    yourMove,
    setUserrMove,
    enemyMove,
    youElement: youRef.current,
    enemyElement: enemyRef.current,
  });

  useEffect(() => {
    if (closeModal) onBattleEnd();
  }, [closeModal, onBattleEnd]);

  return (
    <StyledBattleScreenContainer>
      <div className={`user ${user.name}`} id="user" ref={youRef}>
        <img src={user.sprites.battle_back} alt="" />
      </div>
      <HealthBar
        player="user"
        name={user.name}
        level={100}
        health={yourHealth}
        maxHealth={user.maxHealth}
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
        moveSet={user.moves ?? []}
        onMoveSelect={(move) => setUserrMove(move)}
      />
    </StyledBattleScreenContainer>
  );
};
