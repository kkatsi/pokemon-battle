import { useCallback, useEffect, useState } from "react";
import {
  HEALTH_ANIMATION_DURATION,
  TEXT_ANIMATION_DURATION,
} from "../constants";
import {
  Condition,
  ConditionName,
  Move,
  Pokemon,
  UnknownEffect,
} from "../types";
import {
  calculateAttacker,
  calculateMoveImpact,
  isSuccessFull,
} from "../utils/battle";
import { wait } from "../utils/helper";
import { adjustPokemonStat } from "../utils/stats";
import { useDispatch } from "react-redux";

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
  const [yourSideEffect, setYourSideEffect] = useState<Condition>();
  const [enemySideEffect, setEnemySideEffect] = useState<Condition>();
  const [text, setText] = useState("");
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [isAttackInProgress, setIsAttackInProgress] = useState(false);
  const [isAttackPhaseEnded, setIsAttackPhaseEnded] = useState(false);
  const [turnState, setTurnState] = useState<"first-half" | "second-half">(
    "first-half"
  );
  const [turn, setTurn] = useState(1);
  const [isBattleEnd, setIsBattleEnd] = useState(false);
  const dispatch = useDispatch();

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
    async (playerName: string, damage: number) => {
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
      await wait(HEALTH_ANIMATION_DURATION);
    },
    [enemy.name]
  );

  const handleEffectivenessMessage = useCallback(
    (effectiveness: number, name: string) => {
      switch (effectiveness) {
        case 0:
          setText(`It doesn't affect ${name}!`);
          break;
        case 0.5:
          setText("It's not very effective...");
          break;
        case 2:
          setText("It's super effective!");
          break;
        case 4:
          setText("It's super effective!");
          break;
        default:
          return;
      }
    },
    []
  );

  const handleSideEffect = useCallback(
    async (sideEffect: Exclude<Condition, UnknownEffect>, name: string) => {
      if (!isSuccessFull(sideEffect.chanceToHit)) return;
      if (
        (name === you.name && yourSideEffect) ||
        (name === enemy.name && enemySideEffect)
      )
        setText(`${name} is already effected!`);
      else {
        name === you.name
          ? setYourSideEffect(sideEffect)
          : setEnemySideEffect(sideEffect);
        switch (sideEffect.name) {
          case ConditionName.FREEZE:
            setText(`${name} was frozen solid!`);
            break;
          case ConditionName.SLEEP:
            setText(`${name} fell asleep!`);
            break;
          case ConditionName.PARALYSIS:
            setText(`${name} is paralyzed! It can't move!`);
            dispatch(adjustPokemonStat(name, "speed", sideEffect.speed));
            dispatch(adjustPokemonStat(name, "accuracy", sideEffect.accuracy));
            break;
          default:
            break;
        }
      }

      await wait(TEXT_ANIMATION_DURATION);
    },
    [dispatch, enemy.name, enemySideEffect, you.name, yourSideEffect]
  );

  const handleMoveDisableSideEffect = useCallback(
    async (activeSideEffect: Condition, name: string) => {
      let canMove = true;
      switch (activeSideEffect.name) {
        case ConditionName.FREEZE:
          if (!isSuccessFull(activeSideEffect.chanceToReset)) {
            setText(`${name} is frozen solid!`);
            canMove = false;
          } else {
            setText(`${name} is not longer frozen!`);
            name === you.name
              ? setYourSideEffect(undefined)
              : setEnemySideEffect(undefined);
          }
          await wait(TEXT_ANIMATION_DURATION);
          break;
        case ConditionName.SLEEP:
          if (!isSuccessFull(activeSideEffect.chanceToReset)) {
            setText(`${name} is fast asleep...`);
            canMove = false;
          } else {
            setText(`${name} woke up!`);
            name === you.name
              ? setYourSideEffect(undefined)
              : setEnemySideEffect(undefined);
          }
          await wait(TEXT_ANIMATION_DURATION);
          break;
        case ConditionName.CONFUSION:
          setText(`${name} is confused!`);
          await wait(TEXT_ANIMATION_DURATION);
          if (!isSuccessFull(activeSideEffect.chanceToReset)) {
            setText(`It hurt itself in it's confusion!`);
            await wait(TEXT_ANIMATION_DURATION);
            await animateCharacter({
              target: you.name === name ? you : enemy,
              type: "damage",
            });
            await adjustHealth(name, 100 / 2 + 1);
            canMove = false;
          } else {
            setText(`${name} snapped out of confusion!`);
            name === you.name
              ? setYourSideEffect(undefined)
              : setEnemySideEffect(undefined);
            await wait(TEXT_ANIMATION_DURATION);
            canMove = true;
          }
          break;
        default:
          break;
      }
      return canMove;
    },
    [adjustHealth, animateCharacter, enemy, you]
  );

  const handleEndOfTurnSideEffect = useCallback(
    async (activeSideEffect: Condition, name: string) => {
      switch (activeSideEffect.name) {
        case ConditionName.BURN:
          setText(`${name} is hurt by it's burn!`);
          await wait(TEXT_ANIMATION_DURATION);
          await animateCharacter({
            target: you.name === name ? you : enemy,
            type: "damage",
          });
          await adjustHealth(
            name,
            activeSideEffect.extraDamage *
              (you.name === name ? you.maxHealth : enemy.maxHealth)
          );
          break;
        case ConditionName.POISON:
          setText(`${name} is hurt by poison!`);
          await wait(TEXT_ANIMATION_DURATION);
          await animateCharacter({
            target: you.name === name ? you : enemy,
            type: "damage",
          });
          await adjustHealth(
            name,
            activeSideEffect.extraDamage *
              (you.name === name ? you.maxHealth : enemy.maxHealth)
          );
          break;
        default:
          break;
      }
    },
    [adjustHealth, animateCharacter, enemy, you]
  );

  const attack = useCallback(
    async (
      attacker: Pokemon,
      defender: Pokemon,
      move: Move,
      activeSideEffect?: Condition
    ) => {
      setIsAttackInProgress(true);
      let canMove = true;
      if (activeSideEffect)
        canMove = await handleMoveDisableSideEffect(
          activeSideEffect,
          attacker.name
        );
      if (!isSuccessFull(attacker.stats.accuracy)) canMove = false;
      if (!canMove) {
        setIsAttackInProgress(false);
        return;
      }
      setText(`${attacker.name} used ${move?.name}!`);
      await wait(TEXT_ANIMATION_DURATION);
      const { damage, animate, sideEffect } = calculateMoveImpact(
        move,
        attacker,
        defender
      );

      if (!animate) setText("But it failed...");
      else if (damage.effectiveness) await animateCharacter(animate);

      console.log(damage);

      if (damage.value || (!damage.value && !damage.effectiveness)) {
        handleEffectivenessMessage(damage.effectiveness, defender.name);
        await adjustHealth(defender.name, damage.value);
      }
      if (
        sideEffect?.name !== ConditionName.UNKNOWN &&
        sideEffect !== null &&
        damage.effectiveness
      )
        await handleSideEffect(sideEffect, defender.name);
      setIsAttackInProgress(false);
    },
    [
      adjustHealth,
      animateCharacter,
      handleEffectivenessMessage,
      handleMoveDisableSideEffect,
      handleSideEffect,
    ]
  );

  const handleTurnEnd = useCallback(() => {
    setTurn((prevTurn) => prevTurn + 1);
    setEnemyMove(enemy.moves![0]);
    setYourMove(null);
    setIsTurnInProgress(false);
    setIsAttackPhaseEnded(false);
  }, [enemy.moves, setEnemyMove, setYourMove]);

  useEffect(() => {
    if (!isBattleEnd) setText(`What will ${you.name} do?`);
  }, [turn, isBattleEnd, you.name]);

  useEffect(() => {
    (async () => {
      if (isAttackPhaseEnded) {
        if (yourSideEffect)
          await handleEndOfTurnSideEffect(yourSideEffect, you.name);
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
    you.name,
    yourSideEffect,
  ]);

  useEffect(() => {
    (async () => {
      if (
        enemyMove &&
        yourMove &&
        enemyElement &&
        youElement &&
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
          you,
          enemy,
          yourMove,
          enemyMove,
          yourSideEffect,
          enemySideEffect
        );

        turnState === "first-half"
          ? await attack(firstPlayer, secondPlayer, firstMove, firstSideEffect)
          : await attack(
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
    attack,
    enemy,
    enemyElement,
    enemyMove,
    enemySideEffect,
    isAttackInProgress,
    isAttackPhaseEnded,
    isBattleEnd,
    turnState,
    you,
    youElement,
    yourMove,
    yourSideEffect,
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

  return {
    yourHealth,
    enemyHealth,
    yourSideEffect,
    enemySideEffect,
    text,
    isTurnInProgress,
    isBattleEnd,
  };
};

export default useBattleSequence;
