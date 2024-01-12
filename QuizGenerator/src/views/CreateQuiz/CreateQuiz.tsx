import { useState, useEffect, useContext } from 'react';
import { addQuiz, quizzesRef } from '../../services/quiz.services';
import { onValue } from 'firebase/database';
import { AuthContext } from '../../context/AuthContext';
import { titleCheck } from '../../common/helpers';
import { Question } from '../../common/interfaces';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Buttons/Button';

const CreateQuiz: React.FC = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [contestType, setContestType] = useState('open');
  const [timeLimit, setTimeLimit] = useState(1);
  const [totalPoints, setTotalPoints] = useState<number>(100);
  const [miniPassingPoints, setMiniPassingPoints] = useState<number>(50);
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', answers: [{ text: '', isCorrect: false }] },
  ]);
  const [categories, setCategories] = useState<string[]>(['']);
  const [newCategory, setNewCategory] = useState('');
  const { appState } = useContext(AuthContext);
  const username = appState?.userData?.username;

  useEffect(() => {
    onValue(quizzesRef, (snapshot) => {
      const categories: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.val();
        if (!categories.includes(data.category)) {
          categories.push(data.category);
        }
      });
      setCategories(categories);
    });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const finalCategory = newCategory ? newCategory : category;

    if (
      !/[A-Z][a-z]*$/.test(title.split(' ')[0]) ||
      !/[A-Z][a-z]*$/.test(finalCategory.split(' ')[0])
    ) {
      toast.error('The first word of Title and Category must start with a capital letter followed by lowercase letters!');
      return;
    }

    titleCheck(title);

    addQuiz(
      username ?? '',
      title,
      description,
      contestType,
      timeLimit,
      finalCategory,
      questions,
      miniPassingPoints,
      totalPoints
    )
      .then(() => {
        setTitle('');
        setDescription('');
        setCategory('');
        setContestType('open');
        setTimeLimit(30);
        setMiniPassingPoints(0);
        setQuestions([
          { question: '', answers: [{ text: '', isCorrect: false }] },
        ]);
      })
      .then(() => {
        toast.success('Successfully created quiz!');
      })
      .catch((error) => {
        toast.error('Error adding document: ', error);
      });
  };


  return (
    <>
      <div className="mt-10 p-8 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto">
          <div className=" text-center pb-4">
            <h1 className="text-6xl text-black dark:text-zinc-200 font-bold leading-tighter tracking-tighter">
              Create your {' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-orange-500">
                own {' '}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
                Quiz
              </span>
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded shadow-lg p-4 px-4 md:p-8">
            {/* <div className="grid gap-4 gap-y-2 text-sm lg:grid-cols-3"> */}
            <div>
              <div>
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                  <div className="md:col-span-3">
                    <label>Title:</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label>Description:</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Select Category:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full p-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-zinc-400 dark:text-zinc-800"
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label>Create new category:</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Contest Type:</label>
                    <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      onChange={(e) => setContestType(e.target.value)}
                    >
                      <option value="open">Open Contest</option>
                      <option value="invitational">Invitational Contest</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label>Time Limit (in minutes)</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Total Points:</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="number"
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(parseInt(e.target.value, 10))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Min Pass Score:</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="number"
                      value={miniPassingPoints}
                      onChange={(e) => setMiniPassingPoints(parseInt(e.target.value, 10))}
                      required
                    />
                  </div>
                </div>
                {questions.map((question, index) => (
                  <div key={index} className="text-sm">
                    <div>
                      <label>Question:</label>
                      <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        type="text"
                        value={question.question}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].question = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        required
                      />
                    </div>

                    {question.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="text-sm">
                        <div>
                          <label>Answer:</label>
                          <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            type="text"
                            value={answer.text}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[index].answers[answerIndex].text =
                                e.target.value;
                              setQuestions(newQuestions);
                            }}
                            required
                          />
                        </div>
                        <label className="block">
                          <input
                            className="w-4 h-4 mr-2 mt-2 rounded transition duration-500 ease-in-out text-green-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[index].answers[answerIndex].isCorrect =
                                e.target.checked;
                              setQuestions(newQuestions);
                            }}
                          />
                          <span className="text-gray-700 font-bold">
                            Is this the correct answer?
                          </span>
                        </label>
                      </div>
                    ))}
                    {/* <button
                      type="button"
                      onClick={() => {
                        setQuestions((prevQuestions) => {
                          return prevQuestions.map((q, qIndex) => {
                            if (qIndex !== index) {
                              return q;
                            }
                            return {
                              ...q,
                              answers: [...q.answers, { text: '', isCorrect: false }],
                            };
                          });
                        });
                      }}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-violet-600 dark:hover:bg-violet-500 rounded-md hover:bg-green-500 transform transition duration-500 ease-in-out hover:scale-105"
                    >
                      Add Answer
                    </button> */}
                    <div className="mt-2 py-2">
                      <Button text="Add Answer" buttonType="button" onClickFunction={() => {
                        setQuestions((prevQuestions) => {
                          return prevQuestions.map((q, qIndex) => {
                            if (qIndex !== index) {
                              return q;
                            }
                            return {
                              ...q,
                              answers: [...q.answers, { text: '', isCorrect: false }],
                            };
                          });
                        });
                      }} />
                    </div>
                  </div>
                ))}
                <div className="py-2 flex justify-between items-end">
                  <Button text="Add Question" buttonType="button" onClickFunction={() => {
                    setQuestions((prevQuestions) => [
                      ...prevQuestions,
                      { question: '', answers: [{ text: '', isCorrect: false }] },
                    ]);
                  }} />
                  <Button text="Create Quiz" buttonType="submit" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;
