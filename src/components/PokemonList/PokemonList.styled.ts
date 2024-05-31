import styled from "styled-components";

export const StyledPokemonListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;

  input {
    font-family: inherit;
    font-size: 16px;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    color: white;
    border: 0;
    background-color: #212121;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  ul {
    margin: 0;
    padding: 0;
    border-radius: 8px;
    overflow-y: auto;
    height: calc(100dvh - 16px - 160px - 12px - 12px - 58px - 16px - 28px);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    /* width */
    &::-webkit-scrollbar {
      width: 1px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 8px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: white;
      border-radius: 8px;
    }

    li {
      list-style: none;
      text-align: center;
      margin-top: 1px;
      margin-left: 1px;
      max-width: calc(100% - 2px);
      border-radius: 8px;

      &.active {
        &.user {
          button {
            background: #0075be;
          }
        }
        &.enemy {
          button {
            background: #ff00ff;
          }
        }
      }

      button {
        text-transform: capitalize;
        border-radius: 8px;
        color: white;
        font-size: 16px;
        font-family: "Raleway", sans-serif;
        outline: 0;
        border: 0;
        background-color: transparent;
        padding: 8px;
        margin: 0;
        width: 100%;
        cursor: pointer;

        &:disabled {
          color: gray;
          cursor: not-allowed;
        }
      }

      &:hover:not(:has(button:disabled)) {
        box-shadow: 0 0 0 1px white;
      }
    }
  }
`;
