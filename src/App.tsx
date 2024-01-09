import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import {
  useGetPokemonByNameQuery,
  useGetPokemonMovesetByNameQuery,
} from "./app/api";
import { BattleScreen } from "./components/BattleScreen/BattleScreen";
import { IntroScreen } from "./components/IntroScreen/IntroScreen";
import useGetSelectedPokemons from "./hooks/useGetSelectedPokemons";
import { PageLayout } from "./layouts/PageLayout.styled";
import { Pokemon } from "./types";
import { wait } from "./utils/helper";

function App() {
  const { you, enemy } = useGetSelectedPokemons();
  const { data: yourPokemon } = useGetPokemonByNameQuery(you ?? skipToken);
  const { data: enemyPokemon } = useGetPokemonByNameQuery(enemy ?? skipToken);
  const { data: yourPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    yourPokemon ? { name: yourPokemon.name, moves: ["fire-blast"] } : skipToken
  );
  const { data: enemyPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    enemyPokemon
      ? { name: enemyPokemon.name, moves: enemyPokemon.moveNames }
      : skipToken
  );

  const yourPokemonWithMoves = {
    ...yourPokemon,
    moves: yourPokemonMoveset,
  } as Pokemon;
  const enemyPokemonWithMoves = {
    ...enemyPokemon,
    moves: enemyPokemonMoveset,
  } as Pokemon;
  const [showBattleScreen, setShowBattleScreen] = useState(false);

  useEffect(() => {
    (async () => {
      await wait(4000);
      setShowBattleScreen(true);
    })();
  }, []);

  return (
    <PageLayout>
      <IntroScreen you={yourPokemon} enemy={enemyPokemon} />
      {showBattleScreen &&
        yourPokemonWithMoves.moves &&
        enemyPokemonWithMoves.moves && (
          <BattleScreen
            you={yourPokemonWithMoves}
            enemy={enemyPokemonWithMoves}
          />
        )}
    </PageLayout>
  );
}

export default App;
