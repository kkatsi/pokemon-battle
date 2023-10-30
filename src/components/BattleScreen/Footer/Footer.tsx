import React, { useState, useCallback } from "react";
import { StyledFooterContainer } from "./Footer.styled";
import { Move } from "../../../types";

interface FooterProps {
  displayText: string;
  moveSet: Move[];
  onMoveSelect: (move: unknown) => void;
}

const Footer: React.FC<FooterProps> = ({
  displayText,
  moveSet,
  onMoveSelect,
}) => {
  const [currentPPs, setCurrentPPs] = useState(moveSet.map((move) => move.pp));

  const onMoveClick = useCallback(
    (move: Move, index: number) => {
      setCurrentPPs((prevVal) =>
        prevVal.map((pp, idx) => (index === idx ? pp - 1 : pp))
      );
      onMoveSelect(move);
    },
    [onMoveSelect]
  );

  return (
    <StyledFooterContainer>
      <div className="text-container">{displayText}</div>
      <div className="buttons-container">
        {moveSet.map((move, index) => (
          <button
            disabled={currentPPs[index] < 1}
            key={move.id}
            onClick={() => onMoveClick(move, index)}
          >
            <span className="name">{move.name}</span>
            <span className="pp">
              {currentPPs[index]} / {move.pp}
            </span>
          </button>
        ))}
      </div>
    </StyledFooterContainer>
  );
};

export default Footer;
