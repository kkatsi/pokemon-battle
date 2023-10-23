export const wait = (ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
