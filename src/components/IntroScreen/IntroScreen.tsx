import React, { useEffect, useRef, useState } from "react";
import { StyledIntroScreenContainer } from "./IntroScreen.styled";
import { Pokemon } from "../../types";
import { findColor } from "../../utils/color";
import { wait } from "../../utils/helper";

interface IntroScreenProps {
  you?: Pokemon;
  enemy?: Pokemon;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ you, enemy }) => {
  const yourColor = findColor(you?.type);
  const enemyColor = findColor(enemy?.type);

  const [showVS, setShowVS] = useState(false);

  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      await wait(1000);
      setShowVS(true);
      await wait(3000);

      if (
        leftSideRef.current &&
        rightSideRef.current &&
        vsRef.current &&
        containerRef.current
      ) {
        const leftSideElement = leftSideRef.current;
        const rightSideElement = rightSideRef.current;
        const vsElement = vsRef.current;
        const containerElement = containerRef.current;
        leftSideElement.classList.add("exit");
        rightSideElement.classList.add("exit");
        vsElement.classList.add("exit");
        await wait(1000);
        containerElement.style.display = "none";
      }
    })();
  }, []);

  return (
    <StyledIntroScreenContainer ref={containerRef}>
      <div className="inner-container">
        <div
          className="left"
          ref={leftSideRef}
          style={{ backgroundColor: yourColor }}
        >
          <img src={you?.sprites.default} alt="" />
        </div>
        {showVS && (
          <div className="versus-container" ref={vsRef}>
            <span
              className="versus v"
              style={{
                textShadow: `   -6px -6px 0 ${enemyColor},  
          6px -6px 0 ${enemyColor},
          -6px 6px 0 ${enemyColor},
           6px 6px 0 ${enemyColor}`,
              }}
            >
              V
            </span>
            <span
              className="versus s"
              style={{
                textShadow: `   -6px -6px 0 ${yourColor},  
          6px -6px 0 ${yourColor},
          -6px 6px 0 ${yourColor},
           6px 6px 0 ${yourColor}`,
              }}
            >
              S
            </span>
          </div>
        )}

        <div
          className="right"
          ref={rightSideRef}
          style={{ backgroundColor: enemyColor }}
        >
          <img src={enemy?.sprites.default} alt="" />
        </div>
      </div>
    </StyledIntroScreenContainer>
  );
};