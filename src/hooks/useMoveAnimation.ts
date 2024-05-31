import { useCallback } from "react";
import { Player, Pokemon } from "../types";
import { findColor } from "../utils/color";
import { wait } from "../utils/helper";

const useMoveAnimation = (
  userElement: HTMLElement | null,
  enemyElement: HTMLElement | null
) => {
  const executeSpecialAttackAnimation = async (
    player: Player,
    type: string,
    container: HTMLElement
  ) => {
    const animationColor = findColor(type);
    const r = document.querySelector(":root") as HTMLElement;
    r.style.setProperty("--animation-color", animationColor);
    const moveAnimationContainer = document.createElement("div");
    moveAnimationContainer.classList.add("energyBall", player);
    container.appendChild(moveAnimationContainer);
    await wait(2500);
    container.removeChild(moveAnimationContainer);
  };

  const executePhysicalAttackAnimation = async (
    attackerElement: HTMLElement
  ) => {
    attackerElement.classList.add("physical");
    await wait(800);
    attackerElement.classList.remove("physical");
  };

  const animateCharacter = useCallback(
    async (
      target: Pokemon,
      targetAnimationType: "damage" | "status",
      isPokemonMove?: boolean,
      damageType?: string,
      moveType?: string
    ) => {
      let attackerElement = userElement;
      let defenderElement = enemyElement;

      if (userElement?.classList.contains(target.name)) {
        attackerElement = enemyElement;
        defenderElement = userElement;
      }

      if (!defenderElement || !attackerElement) return;

      if (isPokemonMove) {
        switch (damageType) {
          case "physical":
            await executePhysicalAttackAnimation(attackerElement);
            break;
          case "special":
            await executeSpecialAttackAnimation(
              userElement?.classList.contains(target.name)
                ? Player.User
                : Player.Enemy,
              moveType ?? "normal",
              attackerElement
            );
            break;
          default:
            break;
        }
      }

      defenderElement.classList.add(targetAnimationType);
      await wait(1000);
      defenderElement.classList.remove(targetAnimationType);
    },
    [enemyElement, userElement]
  );

  return animateCharacter;
};

export default useMoveAnimation;
