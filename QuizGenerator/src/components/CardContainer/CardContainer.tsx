import SingleQuizCard from '../SingleQuizCard/SingleQuizCard';
import { Quiz } from '../../common/interfaces';

interface CardContainerProps {
  quizzes: Quiz[];
}

const CardContainer: React.FC<CardContainerProps> = ({ quizzes }) => {

  return (
    <>
      {quizzes && <div className="mt-10 mb-16 p-8 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="grid gap-4 gap-y-2 text-sm sm:grid-cols-1 md:grid-cols-3">
            {quizzes.map((quiz: Quiz) => (
              <div key={quiz.id}>
                <SingleQuizCard
                  quiz={quiz}
                />
              </div>
            ))}
          </div>
        </div>
      </div>}
    </>
  );
};
export default CardContainer;