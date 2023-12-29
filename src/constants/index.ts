export const HEALTH_ANIMATION_DURATION = 2000;
export const TEXT_ANIMATION_DURATION = 1500;
export const ANIMATION_DURATION_PER_UNIT = 15; //ms

export const systemPrompt = (
  yourPokemonName: string,
  enemyPokemonName: string,
  enemyPokemonMoveset: string[]
) => `
I will provide you with 4 pokemon moves that belong to a specific pokemon and you have to select one of the that would be the most effective against another pokemon. We will simulate a turn based pokemon battle. Please answer to me only with the name of the move i provided you, i want like a single word. Each time i will provide you with turn number , pokemon 1 health percentage and pokemon 2 health percentage. Pokemons are ${yourPokemonName} vs ${enemyPokemonName}. The 4 moves of ${enemyPokemonName} are ${enemyPokemonMoveset.join(
  ", "
)}.
`;
