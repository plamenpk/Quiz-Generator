/* eslint-disable @typescript-eslint/semi */
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 20;
export const MIN_USER_NAME_LENGTH = 3;
export const PHONE_NUMBER_CHECK = /^\d{10}$/;
export const NAME_CHECK = /^[A-Z][a-z]*$/;

export const ROLE_CHECK = {
  ADMIN: 'admin',
  STUDENT: 'student',
  EDUCATOR: 'educator'
};

export const dateNow = Date.now();

export const QUIZ_STATUS = {
  OPEN: 'open',
  INVITATIONAL: 'invitational'
};

export const CATEGORIES = {
  MATHEMATICS: 'Mathematics',
  IT: 'IT',
  BIOLOGY: 'Biology',
  HISTORY: 'History',
  ASTRONOMY: 'Astronomy'
};
