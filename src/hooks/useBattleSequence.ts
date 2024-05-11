import { useEffect, useState } from "react";
import { Move, Pokemon } from "../types";
import { calculateAttacker } from "../utils/battle";
import useAdjustHealth from "./useAdjustHealth";
import useEndOfTurn from "./useEndOfTurn";
import usePokemonAttack from "./usePokemonAttack";
import useSideEffects from "./useSideEffects";

const useBattleSequence = ({
  user,
  enemy,
  enemyMove,
  setEnemyMove,
  setUserMove,
  userMove,
  userElement,
  enemyElement,
}: {
  user: Pokemon;
  enemy: Pokemon;
  enemyMove?: Move;
  setEnemyMove: (move: Move | undefined) => void;
  userMove?: Move;
  setUserMove: (move: Move | undefined) => void;
  userElement: HTMLElement | null;
  enemyElement: HTMLElement | null;
}) => {
  const [text, setText] = useState("");
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);

  const [isAttackPhaseEnded, setIsAttackPhaseEnded] = useState(false);
  const [turnState, setTurnState] = useState<"first-half" | "second-half">(
    "first-half"
  );

  const { adjustHealth, userHealth, enemyHealth } = useAdjustHealth(
    user,
    enemy
  );

  const {
    userSideEffect,
    handleSideEffect,
    enemySideEffect,
    handleMoveDisableSideEffect,
    handleEndOfTurnSideEffect,
  } = useSideEffects(
    user,
    enemy,
    setText,
    userElement,
    enemyElement,
    adjustHealth
  );

  const { handleAttack, isAttackInProgress } = usePokemonAttack(
    userElement,
    enemyElement,
    setText,
    handleMoveDisableSideEffect,
    handleSideEffect,
    adjustHealth
  );

  const { isBattleEnd, closeModal } = useEndOfTurn(
    enemy,
    user,
    userElement,
    enemyElement,
    userHealth,
    enemyHealth,
    setUserMove,
    setEnemyMove,
    setText,
    setIsTurnInProgress,
    setIsAttackPhaseEnded,
    isAttackPhaseEnded,
    handleEndOfTurnSideEffect,
    userSideEffect,
    enemySideEffect
  );

  useEffect(() => {
    (async () => {
      if (
        enemyMove &&
        userMove &&
        enemyElement &&
        userElement &&
        !isBattleEnd &&
        !isAttackInProgress &&
        !isAttackPhaseEnded
      ) {
        setIsTurnInProgress(true);
        const {
          firstPlayer,
          secondPlayer,
          firstMove,
          secondMove,
          firstSideEffect,
          secondSideEffect,
        } = calculateAttacker(
          user,
          enemy,
          userMove,
          enemyMove,
          userSideEffect,
          enemySideEffect
        );

        turnState === "first-half"
          ? await handleAttack(
              firstPlayer,
              secondPlayer,
              firstMove,
              firstSideEffect
            )
          : await handleAttack(
              secondPlayer,
              firstPlayer,
              secondMove,
              secondSideEffect
            );

        setTurnState((prevState) => {
          switch (prevState) {
            case "first-half":
              return "second-half";
            case "second-half":
              setIsAttackPhaseEnded(true);
              return "first-half";
          }
        });
      }
    })();
  }, [
    handleAttack,
    enemy,
    enemyElement,
    enemyMove,
    enemySideEffect,
    isAttackInProgress,
    isAttackPhaseEnded,
    turnState,
    user,
    userElement,
    userMove,
    userSideEffect,
    isBattleEnd,
  ]);

  return {
    userHealth,
    enemyHealth,
    userSideEffect,
    enemySideEffect,
    text,
    isTurnInProgress,
    isBattleEnd,
    closeModal,
  };
};

export default useBattleSequence;
