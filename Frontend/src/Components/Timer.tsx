import React, { useState, useRef } from "react";

const Timers: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBtn, setActiveBtn] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setActiveBtn("start");
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setActiveBtn("stop");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setActiveBtn("reset");
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(0);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer-card">
      <h2>{formatTime(time)}</h2>

      <div className="buttons">
        <button
          onClick={startTimer}
          className={`start ${activeBtn === "start" ? "active" : ""}`}>
          Start
        </button>

        <button
          onClick={stopTimer}
          className={`stop ${activeBtn === "stop" ? "active" : ""}`}>
          Stop
        </button>

        <button
          onClick={resetTimer}
          className={`reset ${activeBtn === "reset" ? "active" : ""}`}>
          Reset
        </button>

      </div>
    </div>
  );
};

export default Timers;
