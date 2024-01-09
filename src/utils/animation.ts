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

  const beam = document.createElement("div");
  beam.classList.add("beam");
  const energyBall = document.createElement("div");
  energyBall.classList.add("energyBall");

  container.appendChild(energyBall);

  await wait(1500);

  container.removeChild(energyBall);

  container.appendChild(beam);

  await wait(1000);

  container.removeChild(beam);
};
