import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
from{
    opacity: 0;
}
to{
    opacity: 1;
}
`;

export const StyledBattleScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("battle-background.webp");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  animation: ${fadeIn} 1.5s ease-in-out forwards;

  .you,
  .enemy {
    position: absolute;
    img {
      width: 200%;
      height: auto;
    }
  }

  .you {
    left: 20%;
    bottom: 20%;
  }
  .enemy {
    right: 32%;
    top: 25%;
  }

  @media (max-width: 750px) {
    .you,
    .enemy {
      img {
        width: 150%;
        height: auto;
      }
    }
    .enemy {
      right: 28%;
      top: 20%;
    }
  }
  @media (max-width: 550px) {
    .you,
    .enemy {
      img {
        width: 100%;
        height: auto;
      }
    }
    .enemy {
      right: 23%;
      top: 25%;
    }
  }
`;
