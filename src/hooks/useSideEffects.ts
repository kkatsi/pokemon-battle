import { useState } from "react";
import { Condition, ConditionName, Pokemon, UnknownEffect } from "../types";
import { isSuccessful } from "../utils/battle";
import { adjustPokemonStat } from "../utils/stats";
import { useDispatch } from "react-redux";
import { wait } from "../utils/helper";
import {
  CHANCE_TO_ATTACK_IN_CONFUSION,
  TEXT_ANIMATION_DURATION,
} from "../constants";
import useMoveAnimation from "./useMoveAnimation";

const useSideEffects = (
  user: Pokemon,
  enemy: Pokemon,
  setText: (text: string) => void,
  userElement: HTMLElement | null,
  enemyElement: HTMLElement | null,
  adjustHealth: (
    playerName: string,
    amount: number,
    isGaining?: boolean
  ) => Promise<void>
) => {
  const dispatch = useDispatch();
  const [userSideEffect, setUserSideEffect] = useState<Condition>();
  const [enemySideEffect, setEnemySideEffect] = useState<Condition>();

  const animateCharacter = useMoveAnimation(userElement, enemyElement);
  const handleSideEffect = async (
    sideEffect: Exclude<Condition, UnknownEffect>,
    name: string
  ) => {
    const isAlreadyEffected =
      (name === user.name && userSideEffect) ||
      (name === enemy.name && enemySideEffect);

    if (!isSuccessful(sideEffect.chanceToHit)) return;
    if (isAlreadyEffected) return setText(`But it failed...`);

    name === user.name
      ? setUserSideEffect(sideEffect)
      : setEnemySideEffect(sideEffect);

    switch (sideEffect.name) {
      case ConditionName.CONFUSION:
        setText(`${name} became confused!`);
        break;
      case ConditionName.BURN:
        setText(`${name} was burned!`);
        dispatch(adjustPokemonStat(name, "attack", sideEffect.attack));
        break;
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

    await wait(TEXT_ANIMATION_DURATION);
  };

  const handleMoveDisableSideEffect = async (
    activeSideEffect: Condition,
    name: string
  ) => {
    let canMove = true;

    const setSideEffect = async (sideEffectText: string) => {
      setText(sideEffectText);
      canMove = false;
      await wait(TEXT_ANIMATION_DURATION);
    };

    const removeSideEffect = async (sideEffectRemovalText: string) => {
      setText(sideEffectRemovalText);
      name === user.name
        ? setUserSideEffect(undefined)
        : setEnemySideEffect(undefined);
      canMove = true;
      await wait(TEXT_ANIMATION_DURATION);
    };

    switch (activeSideEffect.name) {
      case ConditionName.FREEZE:
        if (!isSuccessful(activeSideEffect.chanceToReset))
          await setSideEffect(`${name} is frozen solid!`);
        else await removeSideEffect(`${name} is not longer frozen!`);
        break;
      case ConditionName.SLEEP:
        if (!isSuccessful(activeSideEffect.chanceToReset))
          await setSideEffect(`${name} is fast asleep...`);
        else await removeSideEffect(`${name} woke up!`);
        break;
      case ConditionName.CONFUSION:
        await setSideEffect(`${name} is confused!`);
        if (!isSuccessful(activeSideEffect.chanceToReset)) {
          if (!isSuccessful(CHANCE_TO_ATTACK_IN_CONFUSION)) {
            setText(`It hurt itself in it's confusion!`);
            await wait(TEXT_ANIMATION_DURATION);
            await animateCharacter(user.name === name ? user : enemy, "damage");
            await adjustHealth(name, 100 / 2 + 1);
            canMove = false;
          } else {
            canMove = true;
          }
        } else await removeSideEffect(`${name} snapped out of confusion!`);
        break;
      default:
        break;
    }
    return canMove;
  };

  const handleEndOfTurnSideEffect = async (
    activeSideEffect: Condition,
    name: string
  ) => {
    switch (activeSideEffect.name) {
      case ConditionName.BURN:
        setText(`${name} is hurt by it's burn!`);
        await wait(TEXT_ANIMATION_DURATION);
        await animateCharacter(user.name === name ? user : enemy, "damage");
        await adjustHealth(
          name,
          activeSideEffect.extraDamage *
            (user.name === name ? user.maxHealth : enemy.maxHealth)
        );
        break;
      case ConditionName.POISON:
        setText(`${name} is hurt by poison!`);
        await wait(TEXT_ANIMATION_DURATION);
        await animateCharacter(user.name === name ? user : enemy, "damage");
        await adjustHealth(
          name,
          activeSideEffect.extraDamage *
            (user.name === name ? user.maxHealth : enemy.maxHealth)
        );
        break;
      default:
        break;
    }
  };

  return {
    handleSideEffect,
    handleEndOfTurnSideEffect,
    handleMoveDisableSideEffect,
    userSideEffect,
    enemySideEffect,
  };
};

export default useSideEffects;
