import { useEffect, useState } from "react";
import { HEALTH_ANIMATION_DURATION } from "../constants";

const useCountDown = (initialNumber: number) => {
  const [prevInitialNumber, setPrevInitialNumber] = useState(initialNumber);
  const [number, setNumber] = useState(prevInitialNumber);

  useEffect(() => {
    console.log(prevInitialNumber, initialNumber);
    if (prevInitialNumber > initialNumber) {
      const duration = HEALTH_ANIMATION_DURATION / initialNumber;
      let num = prevInitialNumber;
      let interval: undefined | unknown = undefined;
      if (num === initialNumber) clearInterval(interval);
      interval = setInterval(() => {
        num = num - 1;
        setNumber((prevNumber) => prevNumber - 1);
      }, duration);

      setPrevInitialNumber(initialNumber);
      return () => clearInterval(interval);
    }
  }, [initialNumber, prevInitialNumber]);

  return number;
};

export default useCountDown;
