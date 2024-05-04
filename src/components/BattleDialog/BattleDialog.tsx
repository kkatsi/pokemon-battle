import { useEffect, useRef, useState } from "react";
import useGetSelectedPokemons from "../../hooks/useGetSelectedPokemons";
import { wait } from "../../utils/helper";
import { BattleScreen } from "../BattleScreen/BattleScreen";
import { IntroScreen } from "../IntroScreen/IntroScreen";
import { StyledBattleDialog } from "./BattleDialog.styled";

const BattleDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showBattleScreen, setShowBattleScreen] = useState(false);
  const { yourPokemon, enemyPokemon } = useGetSelectedPokemons();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      (async () => {
        await wait(4000);
        setShowBattleScreen(true);
      })();
    }
  }, []);

  // if (!yourPokemon || !enemyPokemon) return <></>;

  return (
    <StyledBattleDialog ref={dialogRef}>
      <IntroScreen you={yourPokemon} enemy={enemyPokemon} />
      {showBattleScreen && yourPokemon?.moves && enemyPokemon?.moves && (
        <BattleScreen you={yourPokemon} enemy={enemyPokemon} />
      )}
    </StyledBattleDialog>
  );
};

export default BattleDialog;
