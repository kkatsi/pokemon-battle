import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPokemonByNameQuery } from "./app/api";
import useGetSelectedPokemons from "./hooks/useGetSelectedPokemons";
import { useEffect, useState } from "react";
import { wait } from "./utils/helper";
import { IntroScreen } from "./components/IntroScreen/IntroScreen";
import { PageLayout } from "./layouts/PageLayout.styled";
import { BattleScreen } from "./components/BattleScreen/BattleScreen";

function App() {
  const { you, enemy } = useGetSelectedPokemons();
  const { data: yourPokemon } = useGetPokemonByNameQuery(you ?? skipToken);
  const { data: enemyPokemon } = useGetPokemonByNameQuery(enemy ?? skipToken);

  const [showBattleScreen, setShowBattleScreen] = useState(false);

  useEffect(() => {
    (async () => {
      await wait(4000);
      setShowBattleScreen(true);
    })();
  }, []);

  console.log(yourPokemon);

  return (
    <PageLayout>
      <IntroScreen you={yourPokemon} enemy={enemyPokemon} />
      {showBattleScreen && (
        <BattleScreen you={yourPokemon} enemy={enemyPokemon} />
      )}
    </PageLayout>
  );
}

export default App;
