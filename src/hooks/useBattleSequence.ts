import React, { useCallback, useEffect, useState } from "react";
import { Move, Pokemon } from "../types";
import { wait } from "../utils/helper";
import { calculateFirstAttacker, calculateMoveImpact } from "../utils/battle";

const useBattleSequence = ({
  you,
  enemy,
  enemyMove,
  yourMove,
  youElement,
  enemyElement,
}: {
  you: Pokemon;
  enemy: Pokemon;
  enemyMove: Move | null;
  yourMove: Move | null;
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

  useEffect(() => {
    setText(`What will ${you.name} do?`);
  }, [turn]);

  useEffect(() => {
    (async () => {
      if (enemyMove && yourMove && enemyElement && youElement) {
        const { firstPlayer, secondPlayer, firstMove, secondMove } =
          calculateFirstAttacker(you, enemy, yourMove, enemyMove);
        setText(`${firstPlayer.name} used ${firstMove?.name}!`);
        await wait(1500);
        const { damage: firstDamage, animate: firstAnimation } =
          calculateMoveImpact(firstMove, firstPlayer, secondPlayer);
        await animateCharacter(firstAnimation);
        firstPlayer.name === you.name
          ? setEnemyHealth((prevValue) => {
              const result = prevValue - firstDamage;
              return result < 0 ? 0 : result;
            })
          : setYourHealth((prevValue) => {
              const result = prevValue - firstDamage;
              return result < 0 ? 0 : result;
            });
        await wait(2600);
        setText(`${secondPlayer.name} used ${secondMove?.name}!`);
        await wait(1500);
        const { damage: secondDamage, animate: secondAnimation } =
          calculateMoveImpact(secondMove, secondPlayer, firstPlayer);
        await animateCharacter(secondAnimation);
        secondPlayer.name === you.name
          ? setEnemyHealth((prevValue) => {
              const result = prevValue - secondDamage;
              return result < 0 ? 0 : result;
            })
          : setYourHealth((prevValue) => {
              const result = prevValue - secondDamage;
              return result < 0 ? 0 : result;
            });
        await wait(2600);
        setTurn((prevTurn) => prevTurn + 1);
      }
    })();
  }, [
    animateCharacter,
    enemy,
    enemyElement,
    enemyMove,
    you,
    youElement,
    yourMove,
  ]);

  return { yourHealth, enemyHealth, text };
};

export default useBattleSequence;
