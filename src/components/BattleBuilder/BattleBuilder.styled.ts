import styled from "styled-components";

export const StyledBattleBuilderContainer = styled.div`
  padding: 1rem;
  min-height: 100dvh;
  max-height: 100dvh;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  gap: 12px;

  h1 {
    max-width: 400px;
    text-align: center;
    font-family: "Pokemon";
    font-size: 4rem;
    line-height: 1.1;
    margin: 0;
    color: #ffcc00;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #0075be;
  }
  .container {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 250px 2px 250px 1fr;
    width: 100%;
    max-width: 1400px;
    flex: 1;

    .hr {
      height: 50%;
      width: 100%;
      background-color: transparent;
      align-self: center;
      border: 2px dashed #de0030;
    }
  }

  .battle-button {
    border: 0;
    outline: 0;
    color: white;
    background-color: #de0030;
    border-radius: 8px;
    font-size: 16px;
    padding: 16px;
    cursor: pointer;
    font-weight: bold;
    font-family: "Raleway", sans-serif;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`;
