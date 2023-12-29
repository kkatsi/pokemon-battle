import { Condition, Move, Pokemon } from "../types";
import { getConditionEffect } from "./moves";

export const calculateAttacker = (
  you: Pokemon,
  enemy: Pokemon,
  yourMove: Move,
  enemyMove: Move,
  yourSideEffect?: Condition,
  enemySideEffect?: Condition
) => {
  return you.stats.speed >= enemy.stats.speed
    ? {
        firstPlayer: you,
        secondPlayer: enemy,
        firstMove: yourMove,
        secondMove: enemyMove,
        firstSideEffect: yourSideEffect,
        secondSideEffect: enemySideEffect,
      }
    : {
        firstPlayer: enemy,
        secondPlayer: you,
        firstMove: enemyMove,
        secondMove: yourMove,
        firstSideEffect: enemySideEffect,
        secondSideEffect: yourSideEffect,
      };
};

export const isSuccessFull = (accuracy: number) =>
  getARandomChanceBetweenOneAndOneHundred() <= accuracy;

export const calculateMoveImpact = (
  move: Move,
  attacker: Pokemon,
  defender: Pokemon
) => {
  let damage = 0;
  const effectiveness = getTypeEffectiveness(move.type, defender.type);
  console.log(move.type, defender.type);
  if (
    move.accuracy &&
    !isSuccessFull(move.accuracy * (attacker.stats.accuracy / 100))
  )
    return {
      damage: { value: damage, effectiveness },
      sideEffect: null,
      animate: null,
    };
  if (move.damage_type === "status") {
    return {
      damage: { value: damage, effectiveness },
      sideEffect:
        move.short_effect && !move.target.includes("user")
          ? getConditionEffect(move.short_effect, 100)
          : null,
      animate: {
        target: move.target.includes("user") ? attacker : defender,
        type: "status",
      },
    };
  }

  if (move.damage_type === "physical") {
    damage = calculatePokemonDamage(
      attacker.stats.attack,
      defender.stats.defense,
      move.power,
      effectiveness
    );
  }
  if (move.damage_type === "special") {
    damage = calculatePokemonDamage(
      attacker.stats["special-attack"],
      defender.stats["special-defense"],
      move.power,
      effectiveness
    );
  }
  return {
    damage: { value: damage, effectiveness },
    sideEffect:
      move.short_effect && move.effect_chance
        ? getConditionEffect(move.short_effect, move.effect_chance)
        : null,
    animate: { target: defender, type: "damage" },
  };
};

export const calculatePokemonDamage = (
  attackStat: number,
  defenderDefenseStat: number,
  movePower: number,
  typeMultiplier: number,
  attackerLevel: number = 100
): number => {
  // Damage calculation formula
  const damage: number =
    Math.floor(
      (((2 * attackerLevel) / 5 + 2) * attackStat * movePower) /
        defenderDefenseStat /
        50
    ) + 2;

  // Apply type effectiveness multiplier
  const totalDamage: number = Math.floor(damage * typeMultiplier);

  return totalDamage;
};

export const calculateMaxStat = (
  baseStat: number,
  IV: number = 31,
  EV: number = 252,
  level: number = 100,
  natureModifier: number = 1.1
): number => {
  const maxStat =
    (((2 * baseStat + IV + EV / 4) * level) / 100 + 5) * natureModifier;
  return Math.floor(maxStat);
};

export const calculateHealthAnimationDuration = (healthChange: number) => {
  const baseDuration = 1000; // Set a base duration in milliseconds
  const logarithmicFactor = 100; // Set the logarithmic factor

  // Calculate the animation duration using a logarithmic function
  const animationDuration =
    baseDuration + logarithmicFactor * Math.log(healthChange + 1);

  return animationDuration;
};

export const getARandomChanceBetweenOneAndOneHundred = () =>
  Math.floor(Math.random() * (100 - 1 + 1)) + 1;

const getTypeEffectiveness = (moveType: string, defenderType: string[]) => {
  const effectiveness = defenderType
    .map((type) => typeEffectiveness[moveType]?.[type])
    .filter((item) => item !== 0);
  return effectiveness.reduce((a, b) => a * b); // Default to 1 if not found
};

const typeEffectiveness: Record<string, Record<string, number>> = {
  normal: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 0.5,
    ghost: 0,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  fire: {
    normal: 1,
    fire: 0.5,
    water: 0.5,
    electric: 1,
    grass: 2,
    ice: 2,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 2,
    rock: 0.5,
    ghost: 1,
    dragon: 0.5,
    dark: 1,
    steel: 2,
    fairy: 1,
  },
  water: {
    normal: 1,
    fire: 2,
    water: 0.5,
    electric: 1,
    grass: 0.5,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 2,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 2,
    ghost: 1,
    dragon: 0.5,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  electric: {
    normal: 1,
    fire: 1,
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 0,
    flying: 2,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 0.5,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  grass: {
    normal: 1,
    fire: 0.5,
    water: 2,
    electric: 1,
    grass: 0.5,
    ice: 1,
    fighting: 1,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    psychic: 1,
    bug: 0.5,
    rock: 2,
    ghost: 1,
    dragon: 0.5,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  ice: {
    normal: 1,
    fire: 0.5,
    water: 0.5,
    electric: 1,
    grass: 2,
    ice: 0.5,
    fighting: 1,
    poison: 1,
    ground: 2,
    flying: 2,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 2,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  fighting: {
    normal: 2,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 2,
    fighting: 1,
    poison: 0.5,
    ground: 1,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dragon: 1,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 2,
    ice: 1,
    fighting: 1,
    poison: 0.5,
    ground: 0.5,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 0.5,
    ghost: 0.5,
    dragon: 1,
    dark: 1,
    steel: 0,
    fairy: 2,
  },
  ground: {
    normal: 1,
    fire: 2,
    water: 1,
    electric: 2,
    grass: 0.5,
    ice: 1,
    fighting: 1,
    poison: 2,
    ground: 1,
    flying: 0,
    psychic: 1,
    bug: 0.5,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 2,
    fairy: 1,
  },
  flying: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 0.5,
    grass: 2,
    ice: 1,
    fighting: 2,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 2,
    rock: 0.5,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  psychic: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 2,
    poison: 2,
    ground: 1,
    flying: 1,
    psychic: 0.5,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 0,
    steel: 0.5,
    fairy: 1,
  },
  bug: {
    normal: 1,
    fire: 0.5,
    water: 1,
    electric: 1,
    grass: 2,
    ice: 1,
    fighting: 0.5,
    poison: 1,
    ground: 1,
    flying: 0.5,
    psychic: 2,
    bug: 1,
    rock: 1,
    ghost: 0.5,
    dragon: 1,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    normal: 1,
    fire: 2,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 2,
    fighting: 0.5,
    poison: 1,
    ground: 0.5,
    flying: 2,
    psychic: 1,
    bug: 2,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  ghost: {
    normal: 0,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 0,
    poison: 0.5,
    ground: 1,
    flying: 1,
    psychic: 2,
    bug: 1,
    rock: 1,
    ghost: 2,
    dragon: 1,
    dark: 0.5,
    steel: 1,
    fairy: 1,
  },
  dragon: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 2,
    dark: 1,
    steel: 0.5,
    fairy: 0,
  },
  dark: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 0.5,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 2,
    bug: 1,
    rock: 1,
    ghost: 2,
    dragon: 1,
    dark: 0.5,
    steel: 1,
    fairy: 0.5,
  },
  steel: {
    normal: 1,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    grass: 1,
    ice: 2,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    normal: 1,
    fire: 0.5,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 2,
    poison: 0.5,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 2,
    dark: 2,
    steel: 1,
    fairy: 1,
  },
};
