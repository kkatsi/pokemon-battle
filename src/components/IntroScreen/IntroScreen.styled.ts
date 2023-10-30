import styled, { keyframes } from "styled-components";

const landFromTheSky = keyframes`
    from{
        transform: scale(10) translateX(-50%) translateY(-50%);
        opacity: 0;
    }
    to{
        transform: scale(1) translateX(-50%) translateY(-50%);
        opacity: 1;
    }
`;

const fadeOut = keyframes`
from{
    opacity: 1;
}
to{
    opacity: 0;
}
`;

const slideLeft = keyframes`
    from {
        transform: translateX(100%);
    }
    to{
        transform: translateX(0);
    }
`;

const slideRight = keyframes`
    from {
        transform: translateX(-100%);
    }
    to{
        transform: translateX(0);
    }
`;

const slideBackLeft = keyframes`
    from{
        transform: translateX(0);
    }
    to{
        transform: translateX(-100%);
    }
`;

const slideBackRight = keyframes`
from{
    transform: translateX(0);
}
to{
    transform: translateX(100%);
}
`;

export const StyledIntroScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: transparent;

  .inner-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .left,
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    padding: 16px;

    img {
      max-height: 70%;
    }
  }

  .versus-container {
    animation: ${landFromTheSky} 1.2s ease-in-out forwards;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 2;

    &.exit {
      animation: ${fadeOut} 0.8s ease-in-out forwards;
    }

    .versus {
      font-size: 8rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 2;
      font-weight: 900;

      &.v {
        margin-left: -1.7rem;
        margin-top: -1rem;
      }
      &.s {
        margin-left: 1.3rem;
        margin-top: 1rem;
      }
    }

    @media (min-width: 850px) {
      .versus {
        font-size: 11rem;

        &.v {
          margin-left: -2rem;
          margin-top: -1rem;
        }
        &.s {
          margin-left: 1.5rem;
          margin-top: 2rem;
        }
      }
    }
  }

  .left {
    width: calc(50% + 4%);
    align-items: flex-start;
    left: 0;
    clip-path: polygon(0 0, 100% 0%, 85% 100%, 0 100%);
    animation: ${slideRight} 0.8s ease-in-out forwards;

    &.exit {
      animation: ${slideBackLeft} 0.8s ease-in-out forwards;
    }
  }

  .right {
    width: calc(50% + 5%);
    right: 0;
    transform: translateX(100%);
    align-items: flex-end;
    clip-path: polygon(15% 0, 100% 0%, 100% 100%, 0 100%);
    animation: ${slideLeft} 0.8s ease-in-out forwards;
    animation-delay: 2s;

    &.exit {
      animation: ${slideBackRight} 0.8s ease-in-out forwards;
    }
  }
`;
