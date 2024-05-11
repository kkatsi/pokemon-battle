import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectHealthAnimationDuration } from "../app/uiSlice";
import { Condition, Move, Pokemon } from "../types";
import { wait } from "../utils/helper";
import { minmaxMoveDecision } from "../utils/moves";

const useEndOfTurn = (
  enemy: Pokemon,
  user: Pokemon,
  userElement: HTMLElement | null,
  enemyElement: HTMLElement | null,
  userHealth: number,
  enemyHealth: number,
  setUserMove: (move?: Move) => void,
  setEnemyMove: (move?: Move) => void,
  setText: (text: string) => void,
  setIsTurnInProgress: (x: boolean) => void,
  setIsAttackPhaseEnded: (x: boolean) => void,
  isAttackPhaseEnded: boolean,
  handleEndOfTurnSideEffect: (
    activeSideEffect: Condition,
    name: string
  ) => Promise<void>,
  userSideEffect?: Condition,
  enemySideEffect?: Condition
) => {
  const [turn, setTurn] = useState(1);
  const [closeModal, setCloseModal] = useState(false);
  const [isBattleEnd, setIsBattleEnd] = useState(false);
  const healthAnimationDuration = useSelector(selectHealthAnimationDuration);

  const handleTurnEnd = useCallback(() => {
    setTurn((prevTurn) => prevTurn + 1);
    setEnemyMove(minmaxMoveDecision(enemy.moves ?? [], enemy, user));
    setUserMove(undefined);
    setIsTurnInProgress(false);
    setIsAttackPhaseEnded(false);
  }, [
    enemy,
    setEnemyMove,
    setIsAttackPhaseEnded,
    setIsTurnInProgress,
    setUserMove,
    user,
  ]);

  useEffect(() => {
    if (!isBattleEnd) setText(`What will ${user.name} do?`);
  }, [turn, isBattleEnd, user.name, setText]);

  useEffect(() => {
    (async () => {
      if (isAttackPhaseEnded) {
        if (userSideEffect)
          await handleEndOfTurnSideEffect(userSideEffect, user.name);
        if (enemySideEffect)
          await handleEndOfTurnSideEffect(enemySideEffect, enemy.name);
        handleTurnEnd();
      }
    })();
  }, [
    enemy.name,
    enemySideEffect,
    handleEndOfTurnSideEffect,
    handleTurnEnd,
    isAttackPhaseEnded,
    user.name,
    userSideEffect,
  ]);

  useEffect(() => {
    (async () => {
      if (userHealth && enemyHealth) return;
      setIsBattleEnd(true);
      await wait(healthAnimationDuration + 500);
      if (userHealth === 0) {
        userElement?.classList.add("loser");
        setText(`You lost the battle!`);
      } else if (enemyHealth === 0) {
        enemyElement?.classList.add("loser");
        setText(`You won the battle!`);
      }
      await wait(3000);
      setCloseModal(true);
    })();
  }, [
    enemyElement,
    enemyHealth,
    userElement,
    userHealth,
    setText,
    healthAnimationDuration,
  ]);

  return { closeModal, isBattleEnd };
};

export default useEndOfTurn;
