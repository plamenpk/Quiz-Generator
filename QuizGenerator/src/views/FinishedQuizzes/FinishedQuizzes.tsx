import { useState, useEffect } from 'react';
import 'firebase/database';
// import { quizzesRef, } from '../../services/quiz.services';
// import { onValue } from 'firebase/database';
import { dateFormat } from '../../common/helpers';
import { dateNow } from '../../common/constants';
import { Link } from 'react-router-dom';
import { QUIZ_STATUS } from '../../common/constants';
import { getAllQuizzes } from '../../services/quiz.services';
// import toast from "react-hot-toast";

const FinishedQuizzes: React.FC = () => {

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [finishedQuizzes, setFinishedQuizzes] = useState(0);

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
      });
  }, [searchTerm]);

  const finalDate = (ob) => {
    const finalDate = Object.values(ob).map(arr => arr[1]);
    return Math.max(...finalDate);
  };

  // const openQuizzes = finishedQuizzes
  //   ? quizzes.filter(quiz => quiz.assignedUsers === undefined || finalDate(quiz.assignedUsers) > dateNow)
  //   : quizzes.filter(quiz => quiz.scoreBoard !== undefined);

  return (
    <div className="pb-20 overflow-auto p-5">
      <div className="ml-20 text-center text-3xl animate-fade-in font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-gray-500 dark:bg-gradient-to-r dark:from-zinc-300 dark:to-gray-500">
        <p className="mt-10">On this page, you can view all finished quizzes.</p>
        <p className="mt-5 ">You have the option to search for a quiz using the search field,</p>
      </div>
      <div className="mt-20 justify-center items-center border-4 p-10 rounded-lg bg-blue-400 dark:bg-gradient-to-br dark:from-zinc-600">
        <h1 className="mb-5 text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-zinc-600 dark:text-zinc-300">Quizzes</h1>
        <input
          type="text"
          className="border focus-none p-2  rounded mb-5 dark:bg-zinc-400 dark:placeholder-orange-200"
          placeholder="Search for quiz ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <button className="mt-2 px-4 py-2 font-medium text-white bg-violet-400 rounded-md hover:bg-violet-500 dark:bg-violet-600 dark:hover:bg-violet-500 float-right transform transition duration-500 ease-in-out hover:scale-105 dark:text-zinc-100"
          onClick={() => { setFinishedQuizzes((!finishedQuizzes)); }}>{finishedQuizzes ? 'switch to finished quizzes' : 'switch to opened quizzes'}</button> */}
        <table className="table-auto rounded w-full text-center  text-white dark:text-zinc-100">
          <thead className="text-lg dark:bg-gradient-to-br dark:from-zinc-600">
            <tr className="border">
              <th className="  px-4 py-2">Quiz Title</th>
              <th className=" px-4 py-2">Created On</th>
              {finishedQuizzes
                ? <th className=" px-4 py-2">Assigned students </th>
                : <th className=" px-4 py-2">Students result</th>}
              <th className=" px-4 py-2">Assign</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz.id} className="border dark:bg-gradient-to-br dark:from-zinc-800">
                  <td className=" px-4 py-2">{quiz.title}</td>
                  <td className=" px-4 py-2">
                    {dateFormat(quiz.createdOn)}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/quiz-scoreboard/${quiz?.id}`}>
                      {(quiz.scoreBoard ? Object.keys(quiz.scoreBoard).length : 0)}</Link>
                  </td>
                  <td className=" px-4 py-2">
                    <Link to={`/assign-quiz/${quiz?.id}`}
                      className=" px-4 py-1  border-indigo-500 bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded text-center font-medium hover:bg-indigo-500 hover:text-white dark:hover:bg-dark-1 dark:hover:text-white-300"
                    >Assign</Link>
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
  );
};

export default FinishedQuizzes;