import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getQuizById } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { addCommentInUserResults } from '../../services/users.services';
import { onValue, ref } from 'firebase/database';
import { database } from '../../config/firebase-config';
import { Quiz, UserData } from '../../common/interfaces';


const UserAnswers: React.FC = () => {

  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz>();
  const [user, setUser] = useState<UserData>();
  const [showInput, setShowInput] = useState(false);
  const [comment, setComment] = useState('');
  const [answers, setAnswers] = useState<number>();


  useEffect(() => {
    if (id) {
      const [quizId, username] = id.split('--');
      getQuizById(quizId)
        .then((fetchedQuiz) => {
          setQuiz(fetchedQuiz);
        })
        .catch((error) => {
          toast.error('Error fetching quiz details:', error);
        });

      const dbRef = ref(database, `users/${username}`);
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUser(data);
        }
      });

      return () => {
        unsubscribe();
      };
    }

  }, [id]);

  const addCommentHandler = (answers: number): void => {
    setShowInput(!showInput);
    setAnswers(answers);
  };

  const saveComment = (user: string, quiz: string): void => {
    if (answers) { addCommentInUserResults(user, quiz, answers, comment); }
  };

  return (
    <>
      {quiz && user &&
        <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
          <div className="container max-w-screen-lg mx-auto my-3">
            <div className="bg-white rounded shadow-lg p-4 md:p-8">
              <p className="mb-5 text-3xl dark:text-zinc-200">USER ANSWERS.</p>
              <div className="mt-4 ">
                <table className="table-auto rounded w-full text-center text-white dark:text-zinc-100">
                  <thead className=" text-lg border dark:bg-gradient-to-br dark:from-zinc-600">
                    <tr>
                      <th scope="col" className="px-4 py-3 bg-blue-500 text-white">
                        <p className="text-lg">{quiz?.title}</p>
                        <p className="text-lg">{quiz?.category}</p>
                      </th>
                      <th scope="col" className="px-4 py-3 bg-blue-500 text-white"></th>
                    </tr>
                  </thead>
                  {quiz.questions.map((quest, i) => (
                    <tbody key={i}>
                      <tr className="border-b dark:border-indigo-600">
                        <th className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <p className="block text-lg">{quest.question}</p>
                          <div className="relative p-2">
                            <p className="block text-left">Correct answer:
                              {quest.answers && quest.answers.find(item => item.isCorrect === true)
                                ? quest.answers.find(item => item.isCorrect === true)?.text
                                : null}
                            </p>
                            <p className="block text-left">Your answer:  {
                              user?.score && user?.score[quiz?.title].userAnswers
                                ? user?.score[quiz?.title].userAnswers[i]
                                  ? user?.score[quiz?.title].userAnswers[i].text
                                  : '...'
                                : '...'
                            }</p>
                            {
                              user?.score && user?.score[quiz?.title].userAnswers
                              && user?.score[quiz?.title].userAnswers[i]
                              && user?.score[quiz?.title].userAnswers[i].comment
                              && <p className="block text-left"> Comment: {user?.score[quiz?.title].userAnswers[i].comment}</p>}
                          </div>
                        </th>
                        <th>
                          <button className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                            onClick={() => addCommentHandler(i)}>
                            Add comment
                          </button>
                        </th>
                      </tr>
                      {showInput && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30">
                          <div className="bg-indigo-100 py-6 px-32 items-center justify-end rounded text-black">
                            <textarea
                              placeholder="Add comment here..."
                              rows={8}
                              className="rounded-lg w-full py-6 px-6 bg-indigo-100 mt-2 -py focus-within:border-blue-500 focus:outline-none"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="space-x-4">
                              <button className="text-indigo-700" onClick={() => { setComment(''); setShowInput(false); saveComment(user.username, quiz?.title); }}>Save comment</button>
                              <button className="text-indigo-700" onClick={() => setShowInput(false)}>Cancel</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default UserAnswers;
