import React, { useEffect, useRef } from "react";
import { StyledBattleDialog } from "./BattleDialog.styled";

interface BattleDialogProps {
  isOpen: boolean;
}

const BattleDialog: React.FC<BattleDialogProps> = ({ isOpen }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);
  return <StyledBattleDialog ref={dialogRef}>hi</StyledBattleDialog>;
};

export default BattleDialog;
