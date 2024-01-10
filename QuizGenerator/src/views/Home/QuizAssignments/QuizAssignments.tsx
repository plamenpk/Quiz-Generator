import { useState, useEffect } from 'react';
import 'firebase/database';
// import { quizzesRef, } from '../../services/quiz.services';
// import { onValue } from 'firebase/database';
// import { dateFormat } from '../../../common/helpers';
// import { dateNow } from '../../../common/constants';
import { QUIZ_STATUS } from '../../../common/constants';
import { getAllQuizzes } from '../../../services/quiz.services';
import toast from 'react-hot-toast';
import { Quiz } from '../../../common/interfaces';
import Table from '../../../components/UI/Buttons/Tables/Table';

const QuizAssignments: React.FC = () => {

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [finishedQuizzes, setFinishedQuizzes] = useState(true);

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
  
   // const finalDate = (ob) => {
  //   const finalDate = Object.values(ob).map(arr => arr[1]);
  //   return Math.max(...finalDate);
  // };

  // const openQuizzes = finishedQuizzes
  //   ? quizzes.filter(quiz => quiz.assignedUsers === undefined || finalDate(quiz.assignedUsers) > dateNow)
  //   : quizzes.filter(quiz => quiz.scoreBoard !== undefined);

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