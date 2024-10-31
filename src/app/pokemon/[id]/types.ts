type StatType = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export type SpriteType = {
  back_default: string | null;
  front_default: string | null;
};

type AbilityType = {
  ability: {
    name: string;
  };
};

export type GeneraType = {
  language: {
    name: string;
  };
};

export type PokemonInfo = {
  sprites: SpriteType;
  height: number;
  weight: number;
  name: string;
  abilities: AbilityType[];
  stats: StatType[];
};
