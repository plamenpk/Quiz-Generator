import { dateFormat } from '../../common/helpers';
import { useContext, useEffect, useState } from 'react';
import { getQuizById } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Quiz } from '../../common/interfaces';
import { QuizResolvedTypes } from '../../common/interfaces';


const QuizResolved = ({ id, score, resolvedOn }: QuizResolvedTypes): JSX.Element => {

  // const [quiz, setQuiz] = useState<Quiz>({} as Quiz);
  const [quiz, setQuiz] = useState<Quiz>();
  const { appState } = useContext(AuthContext);
  useEffect(() => {
    getQuizById(id)
      .then((fetchedQuiz) => {
        setQuiz(fetchedQuiz);
        console.log(fetchedQuiz);
      })
      .catch((error) => {
        toast.error('Error fetching quiz details:', error);
      });
  }, [id]);
  console.log(quiz);
  return (
    <>
      {quiz && (
        <div className="h-screen flex flex-col bg-cover">
          <section className="m-20">
            <div className="px-4 w-full lg:px-12 ">
              <div className="relative overflow-hidden shadow-md opacity-80 sm:rounded-lg mb-20">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-lg text-gray-700 dark:text-zinc-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 bg-indigo-500 text-black dark:bg-indigo-600"
                        >
                          <p className="text-lg text-start">
                            <p className="text-white text-2xl">Title</p>
                            {quiz?.title}
                          </p>
                          <p className="text-lg text-end">
                            <p className="text-white text-2xl">Category</p>
                            {quiz?.category}
                          </p>
                          <p className="text-lg"> <p className="text-white text-2xl">Results</p>You score {score} on {dateFormat(resolvedOn)}</p>
                        </th>
                      </tr>
                    </thead>
                    {quiz.questions.map((quest, i) => (
                      <tbody key={i}>
                        <tr className=" bg-gradient-to-b from-violet-200 to-indigo-300 hover:shadow-2xl hover:shadow-stone-400 ">
                          <th className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap ">
                            <p className="block text-lg font-bold">
                              <p className="text-2xl">Question</p>
                              {quest.question}
                            </p>
                            <div className="relative p-2">
                              <p className="block text-lg font-bold mt-4">
                                Right answer: <span className=" text-green-500">{' '}
                                  {
                                    quest.answers.find(
                                      (item) => item.isCorrect === true
                                    )?.text
                                  }
                                </span>
                              </p>
                              <div className="block text-lg font-bold">
                                Your response: {'  '}
                                {appState?.userData?.score && appState?.userData?.score[quiz?.title].userAnswers
                                  ? appState?.userData?.score[quiz?.title].userAnswers[i]
                                    ? appState?.userData?.score[quiz?.title].userAnswers[i].text
                                    : '...'
                                  : '...'
                                }
                              </div>
                              {appState?.userData?.score && appState?.userData?.score[quiz?.title].userAnswers
                                && appState?.userData?.score[quiz?.title].userAnswers[i]
                                && appState?.userData?.score[quiz?.title].userAnswers[i].comment
                                && <p className="block text-left">{appState?.userData?.score[quiz?.title].userAnswers[i].comment}</p>}
                            </div>
                          </th>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
// QuizResolved.propTypes = {
//   score: PropTypes.number.isRequired,
//   resolvedOn: PropTypes.number.isRequired,
//   title: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   category: PropTypes.string.isRequired,
//   userAnswers: PropTypes.array.isRequired,
// };
export default QuizResolved;
