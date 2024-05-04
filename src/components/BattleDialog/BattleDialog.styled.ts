import styled from "styled-components";

export const StyledBattleDialog = styled.dialog`
  aspect-ratio: 16/9;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  position: relative;
  padding: 0;
  &::backdrop {
    background-color: black;
    opacity: 0.9;
  }
`;
