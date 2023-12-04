import {
  Burn,
  Freeze,
  Paralysis,
  Poison,
  Sleep,
  Condition,
  ConditionName,
  UnknownEffect,
} from "../types";

export const getConditionEffect = (
  effectString: string,
  effectChance?: number
): Condition => {
  if (isParalyze(effectString))
    return {
      name: ConditionName.PARALYSIS,
      speed: 0.5,
      accuracy: 0.75,
      chanceToHit: effectChance ?? 1,
    } as Paralysis;
  if (isPoison(effectString))
    return {
      name: ConditionName.POISON,
      extraDamage: 1 / 16,
      chanceToHit: effectChance ?? 1,
    } as Poison;
  if (isBurnt(effectString))
    return {
      name: ConditionName.BURN,
      extraDamage: 1 / 16,
      attack: 0.5,
      chanceToHit: effectChance ?? 1,
    } as Burn;
  if (isFrozen(effectString))
    return {
      name: ConditionName.FREEZE,
      chanceToReset: 0.2,
      chanceToHit: effectChance ?? 1,
    } as Freeze;
  if (isSlept(effectString))
    return {
      name: ConditionName.SLEEP,
      chanceToReset: 0.2,
      chanceToHit: effectChance ?? 1,
    } as Sleep;
  if (isConfused(effectString))
    return {
      name: ConditionName.CONFUSION,
      chanceToReset: 0.333,
      chanceToHit: effectChance ?? 1,
    };
  return { name: ConditionName.UNKNOWN } as UnknownEffect;
};

const isParalyze = (effect: string) =>
  effect.toLowerCase().includes("paralyze");
const isPoison = (effect: string) => effect.toLowerCase().includes("poison");
const isBurnt = (effect: string) => effect.toLowerCase().includes("burn");
const isFrozen = (effect: string) => effect.toLowerCase().includes("freeze");
const isSlept = (effect: string) => effect.toLowerCase().includes("sleep");
const isConfused = (effect: string) =>
  effect.toLowerCase().includes("confusion");
