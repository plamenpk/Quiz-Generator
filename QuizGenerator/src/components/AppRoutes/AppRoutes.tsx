import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogIn from '../../views/LogIn/LogIn';
import Register from '../../views/Register/Register';
import Home from '../../views/Home/Home';
import PublicView from '../../views/PublicView/PublicView';
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute';
import Profile from '../../views/Profile/Profile';
import CreateQuiz from '../../views/CreateQuiz/CreateQuiz';
import SingleQuizView from '../../views/SingleQuizView/SingleQuizView';
import QuizAssignments from '../../views/Home/QuizAssignments/QuizAssignments';
import AssignQuiz from '../../views/AssignQuiz/AssignQuiz';
import AssignedQuizzes from '../../views/AssignedQuizzes/AssignedQuizzes';
import FinishedQuizzes from '../../views/FinishedQuizzes/FinishedQuizzes';
import QuizScoreboard from '../../views/QuizScoreboard/QuizScoreboard';
import UserAnswers from '../../views/UserAnswers/UserAnswers';
import Students from '../../views/Students/Students';
import EditQuiz from '../../views/EditQuiz/EditQuiz';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PublicView />} />
      <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
      <Route path="/createQuiz" element={<CreateQuiz />} />
      <Route path="/single-quiz-view/:id" element={<SingleQuizView />} />
      <Route path="/quiz-assignments" element={<QuizAssignments />} />
      <Route path="/assign-quiz/:id" element={<AssignQuiz />} />
      <Route path="/assigned-quizzes" element={<AssignedQuizzes />} />
      <Route path="/finished-quizzes" element={<FinishedQuizzes />} />
      <Route path="/quiz-scoreboard/:id" element={<QuizScoreboard />} />
      <Route path="/user-answers/:id" element={<UserAnswers />} />
      <Route path="/students" element={<Students />} />
      <Route path="/edit-quiz" element={<EditQuiz />} />
    </Routes>
  );
};

export default AppRoutes;
