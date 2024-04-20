import { totalAllowedMoveNames } from "./moves";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const wait = (ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });

export const getFourRandomMoves = (
  moveList: { move: { name: string; url: string } }[]
) => {
  const getAllowedRandomMoves = (movesFound?: number) => {
    const randomMoves = getRandomItems(
      moveList,
      4 - (movesFound || 0)
    ) as typeof moveList;

    const randomMovesWithoutStatusTypeExceptAilment = randomMoves.filter(
      (move) => totalAllowedMoveNames.includes(move.move.name)
    );
    return randomMovesWithoutStatusTypeExceptAilment;
  };

  let finalMoves: { move: { name: string; url: string } }[] = [];

  while (finalMoves.length < 4) {
    finalMoves = getAllowedRandomMoves(finalMoves.length);
  }

  return finalMoves.map((move) => move.move.name as string);
};

export const replaceDashesWithSpaces = (string: string) =>
  string.toLowerCase().replaceAll("-", " ");

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function getRandomItems(arr: unknown[], n: number) {
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

export function weightedRandomIndex(weights: number[]): number {
  const totalWeight = weights.reduce((acc, val) => acc + val, 0);
  const randomValue = Math.random() * totalWeight;
  let weightSum = 0;
  for (let i = 0; i < weights.length; i++) {
    weightSum += weights[i];
    if (randomValue <= weightSum) {
      return i;
    }
  }
  return weights.length - 1; // This should never happen
}

export function extractPercentageFromString(str: string) {
  // Regular expression to match percentage patterns
  const regex = /(\d+|half)\/(\d+)/;

  // Match the percentage pattern in the string
  const match = str.match(regex);

  if (match && match.length === 3) {
    let numerator: string | number = match[1];
    if (numerator === "half") {
      numerator = 1; // Treat "half" as 1 in the calculation
    } else {
      numerator = parseInt(numerator);
    }

    // Denominator should be 2 if "half" is used
    const denominator =
      typeof numerator === "string" && numerator === "half"
        ? 2
        : parseInt(match[2]);

    // Calculate the percentage
    const percentage = (numerator / denominator) * 100;
    return percentage;
  } else {
    // No percentage pattern found
    return null;
  }
}
