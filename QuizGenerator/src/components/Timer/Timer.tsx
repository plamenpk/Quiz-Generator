import { useState, useEffect } from 'react';
import { timeLimitInSeconds } from "../../common/helpers";
interface TimeLimitPorps {
  onTimerFinish:()=> void
  timeLimit: number
}

const Timer = ({ onTimerFinish, timeLimit }) => {
  
  const [seconds, setSeconds] = useState(timeLimitInSeconds(timeLimit));

  useEffect(() => {
    if (seconds === 0) {
      onTimerFinish();
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);


    return () => clearInterval(intervalId);
  }, [seconds]);

   const formattedTime = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="text-right mr-4 mt-2 text-lg">
      {formattedTime}
    </div>
  );
};
// Timer.propTypes = {
//   onTimerFinish: PropTypes.func.isRequired,
//   timeLimit: PropTypes.number.isRequired,
// };
export default Timer;
