import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getQuizById } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { Quiz } from '../../common/interfaces';
import { PublicQuizResolvedPropsTypes } from '../../common/interfaces';
import Button from '../../components/UI/Buttons/Button';

const PublicQuizResolved: React.FC<PublicQuizResolvedPropsTypes> = ({ id, score, userAnswers }) => {

  const navigate = useNavigate();
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
    <>
      {quiz && <div className="mt-10 p-8 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto mt-10 mb-48">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 ">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div>
                <div>
                  <span>Title: </span>
                  <span className="text-base font-medium">{quiz?.title}.</span>
                </div>
                <div>
                  <span>Category: </span>
                  <span className="text-base font-medium">{quiz?.category}.</span>
                </div>
                <div>
                  <span>You score: </span>
                  <span className="text-base font-medium">{score}</span>
                </div>
              </div>
              <div className="lg:col-span-2">
                {quiz.questions.map((quest, i) => (

                  <div key={i} className="pb-4">
                    <div className="md:col-span-5 hover:scale-105">
                      <label>Question:</label>
                      <label className="text-base font-medium"> {quest.question}</label>
                      <div className="border mt-1 pb-5 rounded px-4 w-full bg-gray-50">
                        <p className="mt-4">
                          Right answer: <span className="text-base font-medium text-green-500">{' '}
                            {
                              quest.answers.find(
                                (item) => item.isCorrect === true
                              )?.text
                            }
                          </span>
                        </p>
                        <div>
                          Your response: <span className="text-base font-medium">{'  '}
                            {
                              userAnswers
                                ? userAnswers[i]
                                  ? userAnswers[i].text
                                  : '...'
                                : '...'
                            }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="md:col-span-5 text-right">
                  <div className="inline-flex items-end">
                    <Button text="Next Quiz" onClickFunction={() => navigate(-1)} buttonType="button" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default PublicQuizResolved;
