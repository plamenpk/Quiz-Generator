import { useState, useEffect } from 'react';
import { QUIZ_STATUS } from '../../../common/constants';
import { getAllQuizzes } from '../../../services/quiz.services';
import toast from 'react-hot-toast';
import { Quiz } from '../../../common/interfaces';
import Table from '../../../components/UI/Tables/Table';

const QuizAssignments = (): JSX.Element => {

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllQuizzes()
      .then(snapshot => {
        const filteredQuizzes = snapshot.filter(
          (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
          .filter(quiz => quiz.contestType === QUIZ_STATUS.INVITATIONAL);
        setQuizzes(filteredQuizzes);
      })
      .catch(toast.error);
  }, [searchTerm]);

  return (
    <>
      <Table
        quizzes={quizzes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        headCol1="Title"
        headCol2="Category"
        headCol3="Questions"
        headCol4="Assigned students"
        headCol5="Assign"
      // img="\src\assets\IT.jpg"
      />
    </>
  );
};

export default QuizAssignments;