import styled from "styled-components";

export const StyledHealthBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  position: absolute;

  .name-and-level,
  .health-bar-container,
  .health-stats-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name-and-level {
    gap: 64px;
    .name {
      font-size: 20px;
      letter-spacing: 1px;
      font-weight: 900;
      color: whitesmoke;
      -webkit-text-stroke: 1.5px #333333;
      text-transform: capitalize;
    }
    .level-container {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      .label {
        font-size: 14px;
        font-weight: 800;
        letter-spacing: -1px;
        color: #f5cf25;
        -webkit-text-stroke: 1px #333333;
      }
      .value {
        font-size: 20px;
        letter-spacing: -1px;
        font-weight: 800;
        color: whitesmoke;
        -webkit-text-stroke: 1.5px #333333;
        line-height: 20px;
      }
    }
  }

  .health-bar-container {
    background-color: whitesmoke;
    box-shadow: 0 0 0 1px #333333;
    gap: 4px;
    max-height: 12px;
    position: relative;
    .side-effect-label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: bold;
      padding: 0 4px;
      color: white;
    }
    .label {
      font-family: "Alfa Slab One", sans-serif;
      font-size: 12px;
      color: #08d10c;
      -webkit-text-stroke: 1px #333333;
    }
    .health-bar {
      width: 55%;
      height: 7px;
      background-color: #333333;
      border-radius: 100000px;
      box-shadow: 0 0 0 1px #333333;
      margin-top: -0.5px;
      .bar {
        width: 100%;
        height: 100%;
        background-color: #08d10c;
        transition: width ease-in-out;
      }
    }
  }
  .health-stats-container {
    background-color: #333333;
    box-shadow: 0 0 0 1px #333333;
    height: 6px;

    .stat {
      font-family: "Open Sans", sans-serif;
      color: white;
      font-size: 12px;
      line-height: 15px;
    }
  }
`;
