import React, { useCallback, useEffect, useState } from "react";
import { Move, Pokemon } from "../types";
import { wait } from "../utils/helper";
import { calculateMoveImpact } from "../utils/battle";

const useBattleSequence = ({
  you,
  enemy,
  selectedMove,
  youElement,
  enemyElement,
}: {
  you: Pokemon;
  enemy: Pokemon;
  selectedMove: Move | null;
  youElement?: HTMLElement | null;
  enemyElement?: HTMLElement | null;
}) => {
  const [yourHealth, setYourHealth] = useState(you.maxHealth);
  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const [text, setText] = useState("");
  const [turn, setTurn] = useState(1);
  const [player, setPlayer] = useState<"you" | "enemy">("you");

  const animateCharacter = () => {
    if (selectedMove)
      if (player === "you" && enemyElement) {
        enemyElement.classList.add("damaged");
      }
  };

  useEffect(() => {
    setText(`What will ${you.name} do?`);
  }, [player]);

  useEffect(() => {
    // console.log(selectedMove);
    (async () => {
      if (selectedMove) {
        setText(`${you.name} used ${selectedMove?.name}!`);
        await wait(2000);
        setText("this");
        const { damage, animate } = calculateMoveImpact(
          selectedMove,
          you,
          enemy
        );
        setEnemyHealth((prevValue) => prevValue - damage);
      }
    })();
  }, [enemy, selectedMove, you]);

  return { yourHealth, enemyHealth, text };
};

export default useBattleSequence;
