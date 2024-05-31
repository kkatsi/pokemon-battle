import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setHealthAnimationDuration } from "../app/uiSlice";
import { Pokemon } from "../types";
import { calculateHealthAnimationDuration } from "../utils/battle";
import { wait } from "../utils/helper";

const useAdjustHealth = (user: Pokemon, enemy: Pokemon) => {
  const [userHealth, setUserHealth] = useState(user.maxHealth);
  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const dispatch = useDispatch();

  const adjustHealth = useCallback(
    async (playerName: string, amount: number, isGaining?: boolean) => {
      const animationDuration = calculateHealthAnimationDuration(amount);
      dispatch(setHealthAnimationDuration(animationDuration));

      const targetHealthUpdater =
        playerName === enemy.name ? setEnemyHealth : setUserHealth;
      const targetMaxHealth =
        playerName === user.name ? user.maxHealth : enemy.maxHealth;
      const operator = isGaining ? "+" : "-";

      targetHealthUpdater((prevHealth) => {
        const result = prevHealth + (operator === "+" ? amount : -amount);
        return Math.min(Math.max(result, 0), targetMaxHealth);
      });

      await wait(animationDuration + 500);
    },
    [dispatch, enemy.maxHealth, enemy.name, user.maxHealth, user.name]
  );

  return { adjustHealth, userHealth, enemyHealth };
};

export default useAdjustHealth;
