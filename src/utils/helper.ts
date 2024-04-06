import { totalAllowedMoveNames } from "./moves";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const wait = (ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });

export const getFourRandomMoves = (
  moveList: { move: { name: string; url: string } }[],
  movesFound?: number
) => {
  // const onlyFifthGenMoves = moveList.filter((move: any) =>
  //   move.version_group_details.some(
  //     (version: any) => version.version_group.name === "black-white"
  //   )
  // );
  const randomMoves = getRandomItems(
    moveList,
    4 - (movesFound || 0)
  ) as typeof moveList;

  const randomMovesWithoutStatusTypeExceptAilment = randomMoves.filter((move) =>
    totalAllowedMoveNames.includes(move.move.name)
  );
  if (randomMovesWithoutStatusTypeExceptAilment.length < 4)
    getFourRandomMoves(
      moveList,
      randomMovesWithoutStatusTypeExceptAilment.length
    );
  return randomMoves.map((move) => move.move.name as string);
};

export const replaceDashesWithSpaces = (string: string) =>
  string.toLowerCase().replaceAll("-", " ");

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function getRandomItems(arr: unknown[], n: number) {
  console.log(arr, n);
  const result = new Array(n);
  let length = arr.length;
  const taken = new Array(length);
  if (n > length)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * length);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --length in taken ? taken[length] : length;
  }
  return result;
}

export function animateValue(
  obj: HTMLElement,
  start: number,
  end: number,
  duration: number
) {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = String(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
