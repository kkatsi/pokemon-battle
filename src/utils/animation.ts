import { findColor } from "./color";
import { wait } from "./helper";

export const executeSpecialAttackAnimation = async (
  player: "user" | "enemy",
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
