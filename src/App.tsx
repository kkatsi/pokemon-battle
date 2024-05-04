import { useState } from "react";
import BattleBuilder from "./components/BattleBuilder";

import BattleDialog from "./components/BattleDialog";

function App() {
  const [hasOngoingBattle, setHasOngoingBattle] = useState(false);

  return (
    <>
      <BattleBuilder onBattleStart={() => setHasOngoingBattle(true)} />
      {hasOngoingBattle && <BattleDialog />}
    </>
  );
}

export default App;
