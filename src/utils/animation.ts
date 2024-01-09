import { findColor } from "./color";
import { wait } from "./helper";

export const executeSpecialAttackAnimation = async (
  player: "you" | "enemy",
  type: string,
  container: HTMLElement
) => {
  const animationColor = findColor(type);
  const r = document.querySelector(":root") as HTMLElement;
  r.style.setProperty("--animation-color", animationColor);

  const energyBall = document.createElement("div");
  energyBall.classList.add("energyBall");

  container.appendChild(energyBall);

  await wait(2500);

  container.removeChild(energyBall);
};
