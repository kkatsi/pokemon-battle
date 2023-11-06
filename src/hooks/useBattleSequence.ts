import React, { useCallback, useEffect, useState } from "react";
import { Move, Pokemon } from "../types";
import { wait } from "../utils/helper";

const useBattleSequence = ({
  you,
  enemy,
  selectedMove,
}: {
  you: Pokemon;
  enemy: Pokemon;
  selectedMove: Move | null;
}) => {
  const [text, setText] = useState("");
  const [turn, setTurn] = useState(1);
  const [player, setPlayer] = useState<"you" | "enemy">("you");

  useEffect(() => {
    setText(`What will ${you.name} do?`);
  }, [player]);

  useEffect(() => {
    (async () => {
      if (selectedMove) {
        setText(`${you.name} used ${selectedMove?.name}`);
        await wait(2000);
        setText("this");
      }
    })();
  }, [selectedMove]);

  return { you, enemy, text };
};

export default useBattleSequence;
