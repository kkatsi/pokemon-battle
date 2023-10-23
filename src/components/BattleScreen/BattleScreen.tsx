import React from "react";
import { StyledBattleScreenContainer } from "./BattleScreen.styled";
import { Pokemon } from "../../types";

interface BattleScreenProps {
  you?: Pokemon;
  enemy?: Pokemon;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ you, enemy }) => {
  return <StyledBattleScreenContainer>battle</StyledBattleScreenContainer>;
};
