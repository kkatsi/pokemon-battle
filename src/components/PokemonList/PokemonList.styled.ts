import styled from "styled-components";

export const StyledPokemonListContainer = styled.div`
  ul {
    margin: 0;
    padding: 0;
    border-radius: 8px;
    overflow-y: auto;
    max-height: calc(100dvh - 16px - 141px - 12px - 12px - 58px - 16px);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    li {
      list-style: none;
      text-transform: capitalize;
      text-align: center;

      padding: 8px;
      margin-top: 1px;
      margin-left: 1px;
      max-width: calc(100% - 2px);
      border-radius: 8px;

      button {
        color: white;
        font-size: 14px;
        outline: 0;
        border: 0;
        background-color: transparent;
        padding: 0;
        margin: 0;
        width: 100%;
        cursor: pointer;
      }

      &:hover {
        box-shadow: 0 0 0 1px white;
      }
    }
  }
`;
