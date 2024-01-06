import { useEffect, useState } from 'react';
import { getAllQuizzes } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { QUIZ_STATUS } from '../../common/constants';
import CardContainer from '../../components/CardContainer/CardContainer';


const PublicView: React.FC = () => {

  const [quizzes, setQuizzes] = useState([{}]);
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
            Quiz
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
            zle
          </span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
            Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.
          </p>
        </div>
      </div>
      <CardContainer />
    </>
  );
};

export default PublicView;  