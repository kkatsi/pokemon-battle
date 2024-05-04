import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHealthAnimationDuration,
  setHealthAnimationDuration,
} from "../app/uiSlice";
import {
  CHANCE_TO_ATTACK_IN_CONFUSION,
  TEXT_ANIMATION_DURATION,
} from "../constants";
import {
  Condition,
  ConditionName,
  Move,
  Pokemon,
  UnknownEffect,
} from "../types";
import { executeSpecialAttackAnimation } from "../utils/animation";
import {
  calculateAttacker,
  calculateHealthAnimationDuration,
  calculateMoveImpact,
  isSuccessful,
} from "../utils/battle";
import { wait } from "../utils/helper";
import { adjustPokemonStat } from "../utils/stats";
import { minmaxMoveDecision } from "../utils/moves";

const useBattleSequence = ({
  you,
  enemy,
  enemyMove,
  setEnemyMove,
  setYourMove,
  yourMove,
  youElement,
  enemyElement,
}: {
  you: Pokemon;
  enemy: Pokemon;
  enemyMove?: Move;
  setEnemyMove: (move: Move | undefined) => void;
  yourMove: Move | null;
  setYourMove: (move: Move | null) => void;
  youElement?: HTMLElement | null;
  enemyElement?: HTMLElement | null;
}) => {
  const [yourHealth, setYourHealth] = useState(you.maxHealth);
  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const [yourSideEffect, setYourSideEffect] = useState<Condition>();
  const [enemySideEffect, setEnemySideEffect] = useState<Condition>();
  const [text, setText] = useState("");
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [isAttackInProgress, setIsAttackInProgress] = useState(false);
  const [isAttackPhaseEnded, setIsAttackPhaseEnded] = useState(false);
  const [turnState, setTurnState] = useState<"first-half" | "second-half">(
    "first-half"
  );
  const [turn, setTurn] = useState(1);
  const [isBattleEnd, setIsBattleEnd] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const dispatch = useDispatch();
  const healthAnimationDuration = useSelector(selectHealthAnimationDuration);

  const animateCharacter = useCallback(
    async (
      { target, type }: { target: Pokemon; type: string },
      isPokemonMove?: boolean,
      damageType?: string,
      moveType?: string
    ) => {
      const element = youElement?.classList.contains(target.name)
        ? youElement
        : enemyElement;
      if (!element) return;

      if (isPokemonMove) {
        const attacker = !youElement?.classList.contains(target.name)
          ? youElement
          : enemyElement;
        if (!attacker) return;

        switch (damageType) {
          case "physical":
            attacker.classList.add("physical");
            await wait(800);
            attacker.classList.remove("physical");
            break;
          case "special":
            await executeSpecialAttackAnimation(
              youElement?.classList.contains(target.name) ? "you" : "enemy",
              moveType ?? "normal",
              attacker
            );
            break;
          default:
            break;
        }
      }

      element.classList.add(type);
      await wait(1000);
      element.classList.remove(type);
    },
    [enemyElement, youElement]
  );

  const adjustHealth = useCallback(
    async (playerName: string, amount: number, isGaining?: boolean) => {
      const animationDuration = calculateHealthAnimationDuration(amount);
      dispatch(setHealthAnimationDuration(animationDuration));

      const targetHealthUpdater =
        playerName === enemy.name ? setEnemyHealth : setYourHealth;
      const targetMaxHealth =
        playerName === you.name ? you.maxHealth : enemy.maxHealth;
      const operator = isGaining ? "+" : "-";

      targetHealthUpdater((prevHealth) => {
        const result = prevHealth + (operator === "+" ? amount : -amount);
        return Math.min(Math.max(result, 0), targetMaxHealth);
      });

      await wait(animationDuration + 500);
    },
    [dispatch, enemy.maxHealth, enemy.name, you.maxHealth, you.name]
  );

  const handleEffectivenessMessage = useCallback(
    (effectiveness: number, name: string) => {
      switch (effectiveness) {
        case 0:
          setText(`It doesn't affect ${name}!`);
          break;
        case 0.5:
          setText("It's not very effective...");
          break;
        case 2:
          setText("It's super effective!");
          break;
        case 4:
          setText("It's super effective!");
          break;
        default:
          return;
      }
    },
    []
  );

  const handleSideEffect = useCallback(
    async (sideEffect: Exclude<Condition, UnknownEffect>, name: string) => {
      const isAlreadyEffected =
        (name === you.name && yourSideEffect) ||
        (name === enemy.name && enemySideEffect);

      if (!isSuccessful(sideEffect.chanceToHit)) return;
      if (isAlreadyEffected) return setText(`${name} is already effected!`);

      name === you.name
        ? setYourSideEffect(sideEffect)
        : setEnemySideEffect(sideEffect);

      switch (sideEffect.name) {
        case ConditionName.FREEZE:
          setText(`${name} was frozen solid!`);
          break;
        case ConditionName.SLEEP:
          setText(`${name} fell asleep!`);
          break;
        case ConditionName.PARALYSIS:
          setText(`${name} is paralyzed! It can't move!`);
          dispatch(adjustPokemonStat(name, "speed", sideEffect.speed));
          dispatch(adjustPokemonStat(name, "accuracy", sideEffect.accuracy));
          break;
        default:
          break;
      }

      await wait(TEXT_ANIMATION_DURATION);
    },
    [dispatch, enemy.name, enemySideEffect, you.name, yourSideEffect]
  );

  const handleMoveDisableSideEffect = useCallback(
    async (activeSideEffect: Condition, name: string) => {
      console.log(activeSideEffect);
      let canMove = true;

      const setSideEffect = async (sideEffectText: string) => {
        setText(sideEffectText);
        canMove = false;
        await wait(TEXT_ANIMATION_DURATION);
      };

      const removeSideEffect = async (sideEffectRemovalText: string) => {
        setText(sideEffectRemovalText);
        name === you.name
          ? setYourSideEffect(undefined)
          : setEnemySideEffect(undefined);
        await wait(TEXT_ANIMATION_DURATION);
      };

      switch (activeSideEffect.name) {
        case ConditionName.FREEZE:
          if (!isSuccessful(activeSideEffect.chanceToReset))
            setSideEffect(`${name} is frozen solid!`);
          else removeSideEffect(`${name} is not longer frozen!`);
          break;
        case ConditionName.SLEEP:
          if (!isSuccessful(activeSideEffect.chanceToReset))
            setSideEffect(`${name} is fast asleep...`);
          else removeSideEffect(`${name} woke up!`);
          break;
        case ConditionName.CONFUSION:
          setSideEffect(`${name} is confused!`);
          if (!isSuccessful(activeSideEffect.chanceToReset)) {
            if (!isSuccessful(CHANCE_TO_ATTACK_IN_CONFUSION)) {
              setText(`It hurt itself in it's confusion!`);
              await wait(TEXT_ANIMATION_DURATION);
              await animateCharacter({
                target: you.name === name ? you : enemy,
                type: "damage",
              });
              await adjustHealth(name, 100 / 2 + 1);
              canMove = false;
            }
          } else removeSideEffect(`${name} snapped out of confusion!`);
          break;
        default:
          break;
      }
      return canMove;
    },
    [adjustHealth, animateCharacter, enemy, you]
  );

  const handleEndOfTurnSideEffect = useCallback(
    async (activeSideEffect: Condition, name: string) => {
      switch (activeSideEffect.name) {
        case ConditionName.BURN:
          setText(`${name} is hurt by it's burn!`);
          await wait(TEXT_ANIMATION_DURATION);
          await animateCharacter({
            target: you.name === name ? you : enemy,
            type: "damage",
          });
          await adjustHealth(
            name,
            activeSideEffect.extraDamage *
              (you.name === name ? you.maxHealth : enemy.maxHealth)
          );
          break;
        case ConditionName.POISON:
          setText(`${name} is hurt by poison!`);
          await wait(TEXT_ANIMATION_DURATION);
          await animateCharacter({
            target: you.name === name ? you : enemy,
            type: "damage",
          });
          await adjustHealth(
            name,
            activeSideEffect.extraDamage *
              (you.name === name ? you.maxHealth : enemy.maxHealth)
          );
          break;
        default:
          break;
      }
    },
    [adjustHealth, animateCharacter, enemy, you]
  );

  const attack = useCallback(
    async (
      attacker: Pokemon,
      defender: Pokemon,
      move: Move,
      activeSideEffect?: Condition
    ) => {
      setIsAttackInProgress(true);
      let canMove = true;
      if (activeSideEffect)
        canMove = await handleMoveDisableSideEffect(
          activeSideEffect,
          attacker.name
        );
      if (!isSuccessful(attacker.stats.accuracy)) canMove = false;
      if (!canMove) {
        setIsAttackInProgress(false);
        return;
      }
      setText(`${attacker.name} used ${move?.name}!`);
      await wait(TEXT_ANIMATION_DURATION);
      const { damage, animate, sideEffect } = calculateMoveImpact(
        move,
        attacker,
        defender
      );

      if (!animate) {
        setText("But it failed...");
        await wait(TEXT_ANIMATION_DURATION);
      } else if (damage.effectiveness)
        await animateCharacter(animate, true, damage.type, move.type);

      if (damage.value || (!damage.value && !damage.effectiveness)) {
        handleEffectivenessMessage(damage.effectiveness, defender.name);
        await adjustHealth(defender.name, damage.value);
      }
      if (
        sideEffect?.name !== ConditionName.UNKNOWN &&
        sideEffect !== null &&
        damage.effectiveness
      )
        await handleSideEffect(sideEffect, defender.name);
      if (damage.recoilDamage) {
        setText(`${attacker.name} was hurt by the recoil!`);
        await wait(TEXT_ANIMATION_DURATION);
        await adjustHealth(attacker.name, damage.recoilDamage);
      }
      if (damage.healthToDrain) {
        setText(`${defender.name} had it's energy drained!`);
        await wait(TEXT_ANIMATION_DURATION);
        await adjustHealth(attacker.name, damage.healthToDrain, true);
      }
      setIsAttackInProgress(false);
    },
    [
      adjustHealth,
      animateCharacter,
      handleEffectivenessMessage,
      handleMoveDisableSideEffect,
      handleSideEffect,
    ]
  );

  const handleTurnEnd = useCallback(() => {
    setTurn((prevTurn) => prevTurn + 1);
    setEnemyMove(minmaxMoveDecision(enemy.moves ?? [], enemy, you));
    setYourMove(null);
    setIsTurnInProgress(false);
    setIsAttackPhaseEnded(false);
  }, [enemy, setEnemyMove, setYourMove, you]);

  useEffect(() => {
    if (!isBattleEnd) setText(`What will ${you.name} do?`);
  }, [turn, isBattleEnd, you.name]);

  useEffect(() => {
    (async () => {
      if (isAttackPhaseEnded) {
        if (yourSideEffect)
          await handleEndOfTurnSideEffect(yourSideEffect, you.name);
        if (enemySideEffect)
          await handleEndOfTurnSideEffect(enemySideEffect, enemy.name);
        handleTurnEnd();
      }
    })();
  }, [
    enemy.name,
    enemySideEffect,
    handleEndOfTurnSideEffect,
    handleTurnEnd,
    isAttackPhaseEnded,
    you.name,
    yourSideEffect,
  ]);

  useEffect(() => {
    (async () => {
      if (
        enemyMove &&
        yourMove &&
        enemyElement &&
        youElement &&
        !isBattleEnd &&
        !isAttackInProgress &&
        !isAttackPhaseEnded
      ) {
        setIsTurnInProgress(true);
        const {
          firstPlayer,
          secondPlayer,
          firstMove,
          secondMove,
          firstSideEffect,
          secondSideEffect,
        } = calculateAttacker(
          you,
          enemy,
          yourMove,
          enemyMove,
          yourSideEffect,
          enemySideEffect
        );

        turnState === "first-half"
          ? await attack(firstPlayer, secondPlayer, firstMove, firstSideEffect)
          : await attack(
              secondPlayer,
              firstPlayer,
              secondMove,
              secondSideEffect
            );

        setTurnState((prevState) => {
          switch (prevState) {
            case "first-half":
              return "second-half";
            case "second-half":
              setIsAttackPhaseEnded(true);
              return "first-half";
          }
        });
      }
    })();
  }, [
    attack,
    enemy,
    enemyElement,
    enemyMove,
    enemySideEffect,
    isAttackInProgress,
    isAttackPhaseEnded,
    isBattleEnd,
    turnState,
    you,
    youElement,
    yourMove,
    yourSideEffect,
  ]);

  useEffect(() => {
    (async () => {
      if (yourHealth && enemyHealth) return;
      setIsBattleEnd(true);
      await wait(healthAnimationDuration + 500);
      if (yourHealth === 0) {
        youElement?.classList.add("loser");
        setText(`You lost the battle!`);
      } else if (enemyHealth === 0) {
        enemyElement?.classList.add("loser");
        setText(`You won the battle!`);
      }
      await wait(3000);
      setCloseModal(true);
    })();
  }, [
    enemyElement,
    healthAnimationDuration,
    enemyHealth,
    handleTurnEnd,
    youElement,
    yourHealth,
  ]);

  return {
    yourHealth,
    enemyHealth,
    yourSideEffect,
    enemySideEffect,
    text,
    isTurnInProgress,
    isBattleEnd,
    closeModal,
  };
};

export default useBattleSequence;
