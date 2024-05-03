export type Pokemon = {
  name: string;
  originalName: string;
  sprites: {
    showcase: string;
    default: string;
    battle_front: string;
    battle_back: string;
  };
  type: string[];
  moveNames: string[];
  stats: Record<string, number>;
  moves?: Move[];
  maxHealth: number;
};

export type Move = {
  name: string;
  accuracy: number;
  effect_chance: number;
  effect?: string;
  power: number;
  pp: number;
  type: string;
  target: "enemy" | "user";
  damage_type: "status" | "physical" | "special";
  id: number;
};

export enum ConditionName {
  PARALYSIS = "PRZ",
  POISON = "PSN",
  BURN = "BRN",
  FREEZE = "FRZ",
  SLEEP = "SLP",
  UNKNOWN = "UNK",
  CONFUSION = "CNF",
}

export type Paralysis = {
  name: ConditionName.PARALYSIS;
  speed: number;
  accuracy: number;
  chanceToHit: number;
};

export type Poison = {
  name: ConditionName.POISON;
  extraDamage: number;
  chanceToHit: number;
};

export type Burn = {
  name: ConditionName.BURN;
  extraDamage: number;
  attack: 0.5;
  chanceToHit: number;
};

export type Freeze = {
  name: ConditionName.FREEZE;
  chanceToReset: number;
  chanceToHit: number;
};

export type Sleep = {
  name: ConditionName.SLEEP;
  chanceToReset: number;
  chanceToHit: number;
};

export type Confusion = {
  name: ConditionName.CONFUSION;
  chanceToReset: number;
  chanceToHit: number;
};

export type UnknownEffect = {
  name: ConditionName.UNKNOWN;
};

export type Condition =
  | Paralysis
  | Poison
  | Burn
  | Freeze
  | Sleep
  | Confusion
  | UnknownEffect;
