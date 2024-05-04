import { useState } from "react";
import BattleBuilder from "./components/BattleBuilder";

import BattleDialog from "./components/BattleDialog";

function App() {
  const [hasOngoingBattle, setHasOngoingBattle] = useState(false);

  return (
    <>
      <BattleBuilder
        key={hasOngoingBattle.toString()}
        onBattleStart={() => setHasOngoingBattle(true)}
      />
      {hasOngoingBattle && (
        <BattleDialog onBattleEnd={() => setHasOngoingBattle(false)} />
      )}
    </>
  );
}

export default App;
