import { useCallback, useEffect, useState } from "react";
import {
  HEALTH_ANIMATION_DURATION,
  TEXT_ANIMATION_DURATION,
} from "../constants";
import { Move, Pokemon } from "../types";
import { calculateFirstAttacker, calculateMoveImpact } from "../utils/battle";
import { wait } from "../utils/helper";

const useBattleSequence = ({
  you,
  enemy,
  enemyMove,
  setEnemyMove,
  setYourMove,
  yourMove,
  youElement,
  enemyElement,
}: {
  you: Pokemon;
  enemy: Pokemon;
  enemyMove: Move | null;
  setEnemyMove: (move: Move | null) => void;
  yourMove: Move | null;
  setYourMove: (move: Move | null) => void;
  youElement?: HTMLElement | null;
  enemyElement?: HTMLElement | null;
}) => {
  const [yourHealth, setYourHealth] = useState(you.maxHealth);
  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const [text, setText] = useState("");
  const [turn, setTurn] = useState(1);

  const animateCharacter = useCallback(
    async ({ target, type }: { target: Pokemon; type: string }) => {
      const element = youElement?.classList.contains(target.name)
        ? youElement
        : enemyElement;
      if (!element) return;
      console.log(element);
      element.classList.add(type);
      await wait(1000);
      element.classList.remove(type);
    },
    [enemyElement, youElement]
  );

  const adjustHealth = useCallback(
    (playerName: string, damage: number) => {
      let result = 0;
      playerName === enemy.name
        ? setEnemyHealth((prevValue) => {
            result = prevValue - damage;
            return result < 0 ? 0 : result;
          })
        : setYourHealth((prevValue) => {
            result = prevValue - damage;
            return result < 0 ? 0 : result;
          });
      return result;
    },
    [enemy.name]
  );

  const attack = useCallback(
    async (attacker: Pokemon, defender: Pokemon, move: Move) => {
      setText(`${attacker.name} used ${move?.name}!`);
      await wait(TEXT_ANIMATION_DURATION);
      const { damage, animate } = calculateMoveImpact(move, attacker, defender);
      await animateCharacter(animate);
      const newDefendersHealth = adjustHealth(defender.name, damage);
      await wait(HEALTH_ANIMATION_DURATION);
      return newDefendersHealth;
    },
    [adjustHealth, animateCharacter]
  );

  const checkForBattleEnd = useCallback(
    (health: number, attacker: Pokemon) => {
      if (health > 0) return false;

      setText(`You ${attacker.name === you.name ? "won" : "lost"} the battle!`);
      return true;
    },
    [you.name]
  );

  useEffect(() => {
    setText(`What will ${you.name} do?`);
  }, [turn, you.name]);

  useEffect(() => {
    (async () => {
      if (enemyMove && yourMove && enemyElement && youElement) {
        const { firstPlayer, secondPlayer, firstMove, secondMove } =
          calculateFirstAttacker(you, enemy, yourMove, enemyMove);
        let newDefendersHealth = await attack(
          firstPlayer,
          secondPlayer,
          firstMove
        );
        if (checkForBattleEnd(newDefendersHealth, firstPlayer)) return;
        newDefendersHealth = await attack(
          secondPlayer,
          firstPlayer,
          secondMove
        );
        if (checkForBattleEnd(newDefendersHealth, secondPlayer)) return;
        setTurn((prevTurn) => prevTurn + 1);
        setEnemyMove(enemy.moves![0]);
        setYourMove(null);
      }
    })();
  }, [
    attack,
    checkForBattleEnd,
    enemy,
    enemyElement,
    enemyMove,
    setEnemyMove,
    setYourMove,
    you,
    youElement,
    yourMove,
  ]);

  return { yourHealth, enemyHealth, text };
};

export default useBattleSequence;
