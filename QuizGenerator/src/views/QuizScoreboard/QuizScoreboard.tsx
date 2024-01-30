import { useEffect, useState } from 'react';
import { getQuizById } from '../../services/quiz.services';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Quiz } from '../../common/interfaces';

const QuizScoreboard: React.FC = () => {

  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz>();
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
    <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
      <div className="container max-w-screen-lg mx-auto my-3">
        <div className="bg-white rounded shadow-lg p-4 md:p-8">
          <h1 className="mb-5 text-3xl dark:text-zinc-200">Quiz scoreboard</h1>


          <table className="min-w-full text-left font-light">
            <thead className="border-b dark:border-neutral-500">
              <tr>
                <th scope="col" className="px-6 py-2">User</th>
                <th scope="col" className="px-6 py-2">Quiz Title</th>
                <th scope="col" className="px-6 py-2">Score</th>
                <th scope="col" className="px-6 py-2">Max score</th>
                <th scope="col" className="px-6 py-2">View Answers</th>
              </tr>
            </thead>
            <tbody className="text-lg text-black">
              {quiz?.scoreBoard && Object.values(Object.values(quiz?.scoreBoard))
                .sort((a, b) => b.score - a.score)
                .map((user) => (
                  <tr key={user.username} className="border-b dark:border-neutral-500 hover:bg-sky-50">
                    <td className="whitespace-nowrap px-6 py-2 font-light">{user.username}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-light">{quiz.title}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-light">{user.score}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-light">100</td>
                    <td className="whitespace-nowrap px-6 py-2 font-light">
                      <Link to={`/user-answers/${quiz?.id}--${user.username}`}
                        className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105">
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
