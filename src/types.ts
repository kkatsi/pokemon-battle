export type Pokemon = {
  name: string;
  sprites: {
    default: string;
    battle_front: string;
    battle_back: string;
  };
  type: string;
  moveNames: string[];
  moves?: Move[];
};

export type Move = {
  name: string;
  accuracy: number;
  effect_chance: number;
  power: number;
  pp: number;
  type: string;
  id: number;
};
