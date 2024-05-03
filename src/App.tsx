import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import {
  useGetPokemonByNameQuery,
  useGetPokemonMovesetByNameQuery,
} from "./app/api";
import BattleBuilder from "./components/BattleBuilder";
import BattleDialog from "./components/BattleDialog";
import useGetSelectedPokemons from "./hooks/useGetSelectedPokemons";
import { Pokemon } from "./types";
import { wait } from "./utils/helper";

function App() {
  const { you, enemy } = useGetSelectedPokemons();
  const { data: yourPokemon } = useGetPokemonByNameQuery(you ?? skipToken);
  const { data: enemyPokemon } = useGetPokemonByNameQuery(enemy ?? skipToken);
  const { data: yourPokemonMoveset } = useGetPokemonMovesetByNameQuery(
    yourPokemon
      ? { name: yourPokemon.name, moves: yourPokemon.moveNames }
      : skipToken
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

  const [hasOngoingBattle, setHasOngoingBattle] = useState(false);

  useEffect(() => {
    const waitForIntroScreenAnimation = async () => {
      await wait(4000);
      setShowBattleScreen(true);
    };

    if (hasOngoingBattle) {
      waitForIntroScreenAnimation();
    }
  }, [hasOngoingBattle]);

  return (
    <>
      <BattleBuilder onBattleStart={() => setHasOngoingBattle(true)} />
      <BattleDialog isOpen={hasOngoingBattle} />
    </>
  );
}

export default App;
