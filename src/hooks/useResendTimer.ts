import React from "react";

type useResendTimerInitialValues = {
  initialTime?: number;
  initialCoolDown?: boolean;
};
export function useResendTimer({
  initialTime = 60,
  initialCoolDown = false,
}: useResendTimerInitialValues) {
  const [timeLeft, setTimeLeft] = React.useState<number>(initialTime);
  const [isCoolDown, setIsCoolDown] = React.useState<boolean>(initialCoolDown);

  React.useEffect(() => {
    if (timeLeft > 0 && isCoolDown) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCoolDown(false);
    }
  }, [timeLeft, isCoolDown]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsCoolDown(true);
  };

  return { timeLeft, isCoolDown, startTimer };
}
