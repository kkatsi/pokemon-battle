import styled from "styled-components";

export const StyledFooterContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  height: 100px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 5px solid blueviolet;
  padding: 4px 10%;
  display: flex;
  justify-content: center;
  gap: 16px;

  .text-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  .buttons-container {
    height: 100%;
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    button {
      font-family: inherit;
      background-color: transparent;
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      border: 0;
      cursor: pointer;
      text-transform: capitalize;

      .name {
        font-weight: 700;
        font-size: 16px;
      }
      .pp {
        font-weight: 300;
        font-size: 10px;
      }

      &:hover:not(:disabled) {
        box-shadow: 0 0 0 1px white;
        border-radius: 8px;
      }
      &:disabled {
        color: gray;
        cursor: not-allowed;
      }
    }
  }
`;
