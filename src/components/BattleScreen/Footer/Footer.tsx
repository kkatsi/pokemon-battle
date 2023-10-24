import React from "react";
import { StyledFooterContainer } from "./Footer.styled";

interface FooterProps {
  displayText: string;
  moveSet: unknown[];
  onMoveSelect: (move: unknown) => void;
}

const Footer: React.FC<FooterProps> = ({
  displayText,
  moveSet,
  onMoveSelect,
}) => {
  return (
    <StyledFooterContainer>
      <div className="text-container">{displayText}</div>
      <div className="buttons-container">
        <button onClick={() => onMoveSelect("ember")}>Ember</button>
        <button onClick={() => onMoveSelect("flamethrower")}>
          Flamethrower
        </button>
        <button onClick={() => onMoveSelect("earthquake")}>Earthquake</button>
        <button onClick={() => onMoveSelect("smokescreen")}>Smokescreen</button>
      </div>
    </StyledFooterContainer>
  );
};

export default Footer;
