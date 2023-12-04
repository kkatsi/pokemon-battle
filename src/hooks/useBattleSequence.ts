import { useCallback, useEffect, useState } from "react";
import {
  HEALTH_ANIMATION_DURATION,
  TEXT_ANIMATION_DURATION,
} from "../constants";
import { Move, Pokemon } from "../types";
import { calculateAttacker, calculateMoveImpact } from "../utils/battle";
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
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [turnState, setTurnState] = useState<"first-half" | "second-half">(
    "first-half"
  );
  const [turn, setTurn] = useState(1);
  const [isBattleEnd, setIsBattleEnd] = useState(false);

  const animateCharacter = useCallback(
    async ({ target, type }: { target: Pokemon; type: string }) => {
      const element = youElement?.classList.contains(target.name)
        ? youElement
        : enemyElement;
      if (!element) return;
      element.classList.add(type);
      await wait(1000);
      element.classList.remove(type);
    },
    [enemyElement, youElement]
  );

  const adjustHealth = useCallback(
    (playerName: string, damage: number) => {
      if (playerName === enemy.name)
        setEnemyHealth((prevValue) => {
          const result = prevValue - damage;
          return result < 0 ? 0 : result;
        });
      else
        setYourHealth((prevValue) => {
          const result = prevValue - damage;
          return result < 0 ? 0 : result;
        });
    },
    [enemy.name]
  );

  const handleEffectivenessMessage = useCallback((effectiveness: number) => {
    switch (effectiveness) {
      case 0.5:
        setText("It's not very effective...");
        break;
      case 2:
        setText("It's super effetive!");
        break;
      case 4:
        setText("It's super effective!");
        break;
      default:
        return;
    }
  }, []);

  const attack = useCallback(
    async (attacker: Pokemon, defender: Pokemon, move: Move) => {
      setText(`${attacker.name} used ${move?.name}!`);
      await wait(TEXT_ANIMATION_DURATION);
      const { damage, animate, effect } = calculateMoveImpact(
        move,
        attacker,
        defender
      );
      console.log(effect);
      if (!animate) setText("But it failed...");
      else await animateCharacter(animate);
      if (damage.value) handleEffectivenessMessage(damage.effectiveness);
      adjustHealth(defender.name, damage.value);
      await wait(HEALTH_ANIMATION_DURATION);
    },
    [adjustHealth, animateCharacter, handleEffectivenessMessage]
  );

  const handleTurnEnd = useCallback(() => {
    setTurn((prevTurn) => prevTurn + 1);
    setEnemyMove(enemy.moves![0]);
    setYourMove(null);
    setIsTurnInProgress(false);
  }, [enemy.moves, setEnemyMove, setYourMove]);

  useEffect(() => {
    if (!isBattleEnd) setText(`What will ${you.name} do?`);
  }, [turn, you.name, isBattleEnd]);

  useEffect(() => {
    (async () => {
      if (enemyMove && yourMove && enemyElement && youElement && !isBattleEnd) {
        setIsTurnInProgress(true);
        const { firstPlayer, secondPlayer, firstMove, secondMove } =
          calculateAttacker(you, enemy, yourMove, enemyMove);

        turnState === "first-half"
          ? await attack(firstPlayer, secondPlayer, firstMove)
          : await attack(secondPlayer, firstPlayer, secondMove);

        setTurnState((prevState) => {
          switch (prevState) {
            case "first-half":
              return "second-half";
            case "second-half":
              handleTurnEnd();
              return "first-half";
          }
        });
      }
    })();
  }, [
    attack,
    enemy,
    enemyElement,
    enemyMove,
    handleTurnEnd,
    turnState,
    you,
    youElement,
    yourMove,
    isBattleEnd,
  ]);

  useEffect(() => {
    (async () => {
      if (yourHealth && enemyHealth) return;
      setIsBattleEnd(true);
      await wait(HEALTH_ANIMATION_DURATION);
      if (yourHealth === 0) {
        youElement?.classList.add("loser");
        setText(`You lost the battle!`);
      } else if (enemyHealth === 0) {
        enemyElement?.classList.add("loser");
        setText(`You won the battle!`);
      }
    })();
  }, [enemyElement, enemyHealth, handleTurnEnd, youElement, yourHealth]);

  return { yourHealth, enemyHealth, text, isTurnInProgress, isBattleEnd };
};

export default useBattleSequence;
