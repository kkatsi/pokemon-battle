export type Pokemon = {
  name: string;
  sprites: {
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
  power: number;
  pp: number;
  type: string;
  target: "enemy" | "user";
  damage_type: "status" | "physical" | "special";
  id: number;
};
