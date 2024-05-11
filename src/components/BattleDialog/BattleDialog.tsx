import { useEffect, useRef, useState } from "react";
import useGetSelectedPokemons from "../../hooks/useGetSelectedPokemons";
import { wait } from "../../utils/helper";
import { BattleScreen } from "../BattleScreen/BattleScreen";
import { IntroScreen } from "../IntroScreen/IntroScreen";
import { StyledBattleDialog } from "./BattleDialog.styled";

interface BattleDialogProps {
  onBattleEnd: () => void;
}

const BattleDialog: React.FC<BattleDialogProps> = ({ onBattleEnd }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showBattleScreen, setShowBattleScreen] = useState(false);
  const { userPokemon, enemyPokemon } = useGetSelectedPokemons();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      (async () => {
        await wait(4000);
        setShowBattleScreen(true);
      })();
    }
  }, []);

  return (
    <StyledBattleDialog ref={dialogRef}>
      <IntroScreen user={userPokemon} enemy={enemyPokemon} />
      {showBattleScreen && userPokemon?.moves && enemyPokemon?.moves && (
        <BattleScreen
          user={userPokemon}
          enemy={enemyPokemon}
          onBattleEnd={onBattleEnd}
        />
      )}
    </StyledBattleDialog>
  );
};

export default BattleDialog;
