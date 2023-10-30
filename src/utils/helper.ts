export const wait = (ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });

export const getFourRandomMoves = (
  moveList: { move: { name: string; url: string } }[]
) => {
  const randomMoves = getRandomItem(moveList, 4);
  return randomMoves.map((move) => move.move.name as string);
};

export const replaceDashesWithSpaces = (string: string) =>
  string.toLowerCase().replaceAll("-", " ");

function getRandomItem(arr: unknown[], n: number) {
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
