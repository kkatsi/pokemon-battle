import styled from "styled-components";

export const StyledPokemonShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: white;

  span {
    font-size: 18px;
    text-transform: capitalize;
  }

  img {
    width: 50%;
    height: auto;
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    margin-top: 10px;
    width: 20px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 0 #fff4;
    animation: l1 0.8s infinite;
  }
  @keyframes l1 {
    100% {
      box-shadow: 0 0 0 18px #fff4;
    }
  }
`;
