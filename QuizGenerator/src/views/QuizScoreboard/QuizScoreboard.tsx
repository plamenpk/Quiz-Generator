import { useEffect, useState } from 'react';
import { getQuizById } from '../../services/quiz.services';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const QuizScoreboard: React.FC = () => {

  const { id } = useParams();
  const [quiz, setQuiz] = useState();
  useEffect(() => {
    if (id) {
      getQuizById(id)
        .then((fetchedQuiz) => {
          setQuiz(fetchedQuiz);
        })
        .catch((error) => {
          toast.error('Error fetching quiz details:', error);
        });
    }
  }, [id]);

  return (
    <div className="pb-20 overflow-auto">
      <div className="flex flex-col items-center">
        <p className="pt-12 text-3xl font-extrabold bg-clip-text p-1 text-transparent bg-gradient-to-r from-zinc-700 to-gray-500 dark:bg-gradient-to-r dark:from-zinc-300 dark:to-gray-500">
          Welcome to the quiz scoreboard.
        </p>
      </div>

      <div className="flex flex-col p-5 ml-10 mr-10 mt-20 border shadow-md rounded bg-gradient-to-br from-indigo-500 dark:bg-gradient-to-br dark:from-zinc-600">
        <div className="mt-4 ">
          <table className="table-auto rounded w-full text-center text-white dark:text-zinc-100">
            <thead className=" text-lg border dark:bg-gradient-to-br dark:from-zinc-600">
              <tr>
                <th className=" px-4 py-2">User</th>
                <th className=" px-4 py-2">Quiz Title</th>
                <th className=" px-4 py-2">Score</th>
                <th className=" px-4 py-2">Max score</th>
                <th className=" px-4 py-2">View Answers</th>
              </tr>
            </thead>
            <tbody>
              {quiz?.scoreBoard && Object.values(Object.values(quiz?.scoreBoard))
                .sort((a, b) => b.score - a.score)
                .map((user) => (
                  <tr key={user.username} className="border dark:bg-gradient-to-br dark:from-zinc-800">
                    <td className=" px-4 py-2">{user.username}</td>
                    <td className=" px-4 py-2">{quiz.title}</td>
                    <td className=" px-4 py-2">{user.score}</td>
                    <td className=" px-4 py-2">100</td>
                    <td className=" px-4 py-2">
                      <Link to={`/user-answers/${quiz?.id}--${user.username}`}>
                        View User Answers
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizScoreboard;
