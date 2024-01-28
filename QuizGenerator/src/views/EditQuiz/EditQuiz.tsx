import { useState, useEffect, useContext } from 'react';
import 'firebase/database';
import { quizzesRef, updateQuiz } from '../../services/quiz.services';
import { onValue } from 'firebase/database';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { deleteQuiz } from '../../services/quiz.services';
import { Answer, Quiz } from '../../common/interfaces';

const EditQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
  // const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [editedTitle, setEditedTitle] = useState('');
  const [editedAnswers, setEditedAnswers] = useState<Answer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { appState } = useContext(AuthContext);
  // const username = appState?.userData?.username;

  useEffect(() => {
    onValue(quizzesRef, (snapshot) => {
      const data = snapshot.val();
      const filteredQuizzes = (Object.values(data) as Quiz[]).filter(
        (quiz: Quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setQuizzes(filteredQuizzes);
      // console.log(quizzes);
    });
  }, [searchTerm]);

  const handleEditQuiz = (quiz: Quiz): void => {
    setSelectedQuiz(quiz);
    if (quiz.questions && quiz.questions.length > 0) {
      const firstQuestion = quiz.questions[0];
      // setSelectedQuestion(firstQuestion);
      setEditedAnswers(firstQuestion.answers);
    }
    setEditedTitle(quiz.title);
  };

  const handleDelete = (id: string): void => {
    deleteQuiz(id);
  };

  const handleAnswerChange = (questionIndex: number, index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    if (selectedQuiz) {
      const newAnswers = { ...selectedQuiz };
      if (newAnswers.questions && newAnswers.questions[questionIndex]) {
        newAnswers.questions[questionIndex].answers[index].text = event.target.value;
        setEditedAnswers(newAnswers);
      }
    }
  };

  const handleSaveQuestion = (): void => {
    if (selectedQuiz) {
      updateQuiz(selectedQuiz.id, editedAnswers)
        .then(() => toast.success('Quiz updated successfully'))
        .catch((e) => console.log(e));
    } else {
      console.error('Selected quiz is undefined');
    }
  };
  // console.log(appState?.userData?.username)
  return (
    <div className="">
      <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="bg-white rounded shadow-lg p-4 md:p-8">
            <h1 className="mb-5 text-3xl dark:text-zinc-200">Quiz Manage</h1>
            <input
              type="text"
              className="border p-2 rounded w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 dark:bg-zinc-400 hover:bg-sky-50"
              placeholder="Search for Quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="min-w-full text-left font-light">
              <thead className="border-b dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-2">Create By</th>
                  <th scope="col" className="px-6 py-2">Quiz Title</th>
                  <th scope="col" className="px-6 py-2">Created On</th>
                  <th scope="col" className="px-6 py-2">Edit Quiz</th>
                  <th scope="col" className="px-6 py-2">Delete</th>
                </tr>
              </thead>
              <tbody className="text-lg text-black">
                {quizzes.map((quiz) => (
                  quiz.createdBy === appState?.userData?.username && (
                    <tr key={quiz.id} className="border-b dark:border-neutral-500 hover:bg-sky-50">
                      <td className="whitespace-nowrap px-6 py-2 font-light">{quiz.createdBy}</td>
                      <td className="whitespace-nowrap px-6 py-2 font-light">{quiz.title}</td>
                      <td className="whitespace-nowrap px-6 py-2 font-light">
                        {new Date(quiz.createdOn).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2 font-light">
                        <button
                          onClick={() => handleEditQuiz(quiz)}
                          className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                        >
                          Edit Quiz
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-2 font-light">
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="rounded-sm px-3 py-2 bg-red-500 hover:bg-red-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                        >
                          Delete Quiz
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {selectedQuiz && selectedQuiz.questions && (
          <div className="border-2 rounded mt-5 p-5 shadow-md table-auto w-full bg-gradient-to-br from-indigo-400 text-white dark:bg-gradient-to-br dark:from-zinc-800 dark:text-zinc-200">
            <h1 className=" text-3xl mb-6 font-bold text-white dark:text-zinc-200">Edit Quiz</h1>
            <h1 className="font-bold text-2xl"> Title: {editedTitle}</h1>

            {selectedQuiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="my-2">

                <span className="font-bold text-xl">
                  Question: {question.question}
                </span>

                <div className="text-black">
                  {question.answers.map((answer, index) => (
                    <input
                      key={index}
                      className="border-2 rounded p-2 w-full mt-2 dark:bg-zinc-400"
                      type="text"
                      value={answer.text}
                      onChange={(event) =>
                        handleAnswerChange(questionIndex, index, event)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
            <button
              role="alert"
              className="alert alert-success ml-2 bg-green-600 dark:bg-indigo-600 dark:text-zinc-100 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 transform transition duration-500 ease-in-out hover:scale-90"
              onClick={handleSaveQuestion}
            >
              Save changes
            </button>
          </div>
        )}
      
    </div>
  );
};

export default EditQuiz;
