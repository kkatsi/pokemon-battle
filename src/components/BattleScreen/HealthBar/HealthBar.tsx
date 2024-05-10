import React, { useRef, useEffect, useState } from "react";
import { StyledHealthBarContainer } from "./HealthBar.styled";
import { animateValue } from "../../../utils/helper";
import { findColor } from "../../../utils/color";
import { ConditionName } from "../../../types";
import { useSelector } from "react-redux";
import { selectHealthAnimationDuration } from "../../../app/uiSlice";

interface HealthBarProps {
  player: "user" | "enemy";
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  sideEffect?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({
  player,
  name,
  level,
  health,
  maxHealth,
  sideEffect,
}) => {
  const animatedHealthRef = useRef(null);
  const [previousHealth, setPreviousHealth] = useState<number>();
  const healthBarAnimationDuration = useSelector(selectHealthAnimationDuration);

  useEffect(() => {
    if (animatedHealthRef.current) {
      if (previousHealth && previousHealth !== health) {
        animateValue(
          animatedHealthRef.current,
          previousHealth,
          health,
          healthBarAnimationDuration
        );
      }
      setPreviousHealth(health);
    }
  }, [previousHealth, health, healthBarAnimationDuration]);

  const calculateEffectBackgroundColor = (sideEffect: string) => {
    let backgroundColor = "black";
    switch (sideEffect) {
      case ConditionName.FREEZE:
        backgroundColor = findColor("ice");
        break;
      case ConditionName.BURN:
        backgroundColor = findColor("fire");
        break;
      case ConditionName.PARALYSIS:
        backgroundColor = findColor("electric");
        break;
      case ConditionName.POISON:
        backgroundColor = findColor("poison");
        break;
      case ConditionName.SLEEP:
        backgroundColor = findColor("normal");
        break;
      default:
        break;
    }
    return backgroundColor;
  };

  return (
    <StyledHealthBarContainer
      style={{
        bottom: player === "user" ? "calc(105px + 5%)" : "65%",
        right: player === "user" ? "20%" : "auto",
        left: player === "enemy" ? "20%" : "auto",
      }}
    >
      <div className="name-and-level">
        <span className="name">{name}</span>
        <div className="level-container">
          <span className="label">Lv.</span>
          <span className="value">{level}</span>
        </div>
      </div>
      <div className="health-bar-container">
        {sideEffect && (
          <div
            className="side-effect-label"
            style={{ background: calculateEffectBackgroundColor(sideEffect) }}
          >
            {sideEffect}
          </div>
        )}
        <span className="label">HP</span>
        <div className="health-bar">
          <div
            className="bar"
            style={{
              width: `${(health / maxHealth) * 100}%`,
              transitionDuration: `${healthBarAnimationDuration / 1000}s`,
            }}
          />
        </div>
      </div>
      <div
        className="health-stats-container"
        style={{ height: player === "user" ? "12px" : "4px" }}
      >
        {player === "user" && (
          <span className="stat">
            <span ref={animatedHealthRef}>{health}</span> / {maxHealth}
          </span>
        )}
      </div>
    </StyledHealthBarContainer>
  );
};

export default HealthBar;
