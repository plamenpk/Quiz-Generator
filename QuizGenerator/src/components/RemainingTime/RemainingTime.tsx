import { useState, useEffect } from 'react';
import { updateUserScore } from '../../services/users.services';
import toast from 'react-hot-toast';
import {
  removeFromAssignments,
  removeAssignmentsFromQuiz,
  removeAssignmentsFromUser
} from '../../services/quiz.services';
import { RemainingTimeTypes } from '../../common/interfaces';
import { SECONDS_IN_DAY } from '../../common/constants';
import { SECONDS_IN_HOUR } from '../../common/constants';
import { SECONDS_IN_MINUTE } from '../../common/constants';

const RemainingTime: React.FC<RemainingTimeTypes> = ({ timeLimit, username, id, title, score, category }) => {

  const [seconds, setSeconds] = useState<number>(timeLimit + 86400);

  useEffect(() => {
    if (seconds <= 0) {
      updateUserScore(username, id, title, score, category, [], 0, 0)
        .then(() => console.log('Quiz result saved successfully'))
        .catch((e: Error) => toast.error(e.message));

      removeFromAssignments(username, id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e: Error) => toast.error(e.message));

      removeAssignmentsFromQuiz(username, id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e: Error) => toast.error(e.message));

      removeAssignmentsFromUser(username, id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e) => toast.error(e));
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return (): void => clearInterval(intervalId);
  }, [seconds, username, id, title, score, category]);

  const days = Math.floor(seconds / SECONDS_IN_DAY);
  const hours = Math.floor((seconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const remainingSeconds = seconds % SECONDS_IN_MINUTE;

  const formattedTime = `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;


  return (
    <div className="text-right mr-4 mt-2 text-lg">
      {formattedTime}
    </div>
  );
};

export default RemainingTime;