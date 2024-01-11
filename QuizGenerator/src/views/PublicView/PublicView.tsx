import { useEffect, useState } from 'react';
import { getAllQuizzes } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { QUIZ_STATUS } from '../../common/constants';
import CardContainer from '../../components/CardContainer/CardContainer';
import { Quiz } from '../../common/interfaces';
import { dateFormat } from '../../common/helpers';


const PublicView: React.FC = () => {

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    getAllQuizzes()
      .then(snapshot => {
        const publicQuizzes = snapshot.filter(quiz => quiz.contestType === QUIZ_STATUS.OPEN);

        const filteredQuizzes = publicQuizzes.filter(
          (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setQuizzes(filteredQuizzes);

      })
      .catch(e => toast.error(e));
  }, [searchTerm]);
  
  return (
    <>
      <div className="pt-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 dark:text-zinc-200" data-aos="zoom-y-out">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-orange-400">
            QuizGe
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
            nerator
          </span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
            Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.
          </p>
        </div>
      </div>
      <CardContainer quizzes={quizzes} />
      <div className="m-10 justify-center items-center border-4 p-10 rounded-lg bg-gradient-to-bl from-indigo-400">
        <h1 className="mb-5 text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-stone-100">Public quiz scoerboard</h1>
        <input
          type="text"
          className="border focus-none p-2 placeholder-amber-300 font-bold rounded mb-5"
          placeholder="Search for quiz ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <button className="mt-2 px-4 py-2 font-medium text-white bg-violet-400 rounded-md hover:bg-green-400 float-right transform transition duration-500 ease-in-out hover:scale-105"
          onClick={() => { setFinishedQuizzes((!finishedQuizzes)) }}>{finishedQuizzes ? 'switch to finished quizzes' : 'switch to opened quizzes'}</button> */}
        <table className="table-auto rounded w-full text-center  text-white">
          <thead className=" text-lg bg-indigo-400">
            <tr className="border border-violet-200 ">
              <th className="  px-4 py-2">Quiz Title</th>
              <th className=" px-4 py-2">Created On</th>
              {/* {finishedQuizzes
                ? <th className=" px-4 py-2">Assigned students </th> */}
              <th className=" px-4 py-2">Attempted</th>
              <th className=" px-4 py-2">Resolved with max score</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border bg-indigo-300 ">
                <td className=" px-4 py-2">{quiz.title}</td>
                <td className=" px-4 py-2">
                  {dateFormat(quiz.createdOn)}
                </td>
                <td className="px-4 py-2">
                  {quiz.scoreBoard ? Object.values(quiz.scoreBoard).length : 0}
                </td>
                <td className=" px-4 py-2">
                  {quiz.scoreBoard ? Object.values(quiz.scoreBoard).filter(el => el.score === 100).length : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PublicView;  