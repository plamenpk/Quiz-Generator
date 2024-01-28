import { useState, useEffect } from 'react';
import { dateFormat } from '../../common/helpers';
import { Link } from 'react-router-dom';
import { QUIZ_STATUS } from '../../common/constants';
import { getAllQuizzes } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { Quiz } from '../../common/interfaces';

const FinishedQuizzes: React.FC = () => {

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllQuizzes()
      .then(snapshot => {
        const filteredQuizzes = snapshot.filter(
          (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
          .filter(quiz => quiz.contestType === QUIZ_STATUS.INVITATIONAL)
          .filter(quiz => quiz.scoreBoard !== undefined);
        setQuizzes(filteredQuizzes);
      })
      .catch(e => toast.error(e));

  }, [searchTerm]);

  return (
    <div className="">
      <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="bg-white rounded shadow-lg p-4 md:p-8">
            <div className="">
              <div className="text-center text-3xl font-bold ">
                <p className="mt-5">On this page, you can view all finished quizzes.</p>
                <p className="mt-5 ">You have the option to search for a quiz using the search field,</p>
              </div>
              <div className="text-sm text-black dark:text-zinc-200">
                <h1 className="my-5 text-5xl  dark:text-zinc-300">Quizzes</h1>
              </div>
              <input
                type="text"
                className="border p-2 rounded w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 dark:bg-zinc-400 hover:bg-sky-50"
                placeholder="Search for quiz ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="mt-4 min-w-full text-left font-light">
              <thead className="border-b dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-2">Quiz Title</th>
                  <th scope="col" className="px-6 py-2">Created On</th>
                  <th scope="col" className="px-6 py-2">Students result</th>
                  <th scope="col" className="px-6 py-2">Assign</th>
                </tr>
              </thead>
              <tbody className="text-lg text-black">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b dark:border-neutral-500 hover:bg-sky-50">
                      <td className="whitespace-nowrap px-6 py-4 font-light">{quiz.title}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-light">
                        {dateFormat(quiz.createdOn)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-light">
                        <Link to={`/quiz-scoreboard/${quiz?.id}`}>
                          {(quiz.scoreBoard ? Object.keys(quiz.scoreBoard).length : 0)}</Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-light">
                        <Link to={`/quiz-scoreboard/${quiz?.id}`}
                          className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                        >QuizScoreboard</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-2xl">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedQuizzes;