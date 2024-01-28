import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.services';
import { quizAssignments, getQuizById } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { Quiz, UserData } from '../../common/interfaces';


const AssignQuiz: React.FC = () => {

  const { id } = useParams();
  const [date, setDate] = useState<string>('');
  const [finalDate, setFinalDate] = useState<string>('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [quiz, setQuiz] = useState<Quiz>({} as Quiz);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    getAllUsers()
      .then(snapshot => {
        const filteredUsers = Object.values(snapshot.val() as Record<string, UserData>).filter(
          (user) =>
            (user as UserData).username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user as UserData).firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user as UserData).lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user as UserData).email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUsers(filteredUsers);
      })
      .catch(e => toast.error(e));
  }, [users, searchTerm]);

  useEffect(() => {
    if (id) {
      getQuizById(id)
        .then(snapshot => {
          snapshot.assignedUsers ?
            setAssignedUsers(Object.keys(snapshot.assignedUsers))
            : assignedUsers;
          setQuiz(snapshot);
        })
        .catch(e => toast.error(e));
    }
  }, [id, assignedUsers]);

  const assignQuizHandler = (user: string): void => {

    const chosenDate = new Date(date);
    const dateInSeconds = chosenDate.getTime();
    const chosenFinalDate = new Date(finalDate);
    const finalDateInSeconds = chosenFinalDate.getTime();
    if (Number.isNaN(dateInSeconds) || Number.isNaN(finalDateInSeconds)) {
      toast.error('date or finalDate can\'t be empty');
      return;
    }

    if (id) {
      quizAssignments(user, id, dateInSeconds, finalDateInSeconds)
        .then(() => {
          toast.success('quiz assigned successfully');
        })
        .catch(e => console.error(e));
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <>
      <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="bg-white rounded shadow-lg p-4 md:p-8">
            <div className=" flex flex-col ">
              <div className=" text-sm text-black flex items-center justify-end dark:text-zinc-200">
                <span className="flex-grow text-xl mb-5"> <span className="text-2xl font-bold">Quiz Title: </span>{quiz?.title}</span>
                <div className="ml-10 mt-14">
                  Open from <input
                    className="border p-2 rounded dark:bg-zinc-400 hover:bg-sky-50"
                    type="datetime-local"
                    placeholder="date"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="ml-10 mt-14">
                  Closed on <input
                    className="border p-2 rounded dark:bg-zinc-400 hover:bg-sky-50"
                    type="datetime-local"
                    onChange={(e) => setFinalDate(e.target.value)}
                  />
                </div>
              </div>
              <input
                type="text"
                className="border p-2 rounded w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 dark:bg-zinc-400 hover:bg-sky-50"
                placeholder="Search for user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <table className="min-w-full text-left font-light">
                <thead className="border-b dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-2">Username</th>
                    <th scope="col" className="px-6 py-2">Last Name</th>
                    <th scope="col" className="px-6 py-2"></th>
                    <th scope="col" className="px-6 py-2">Points</th>
                    <th scope="col" className="px-6 py-2">Action</th>
                  </tr>
                </thead>

                {id && <tbody className="text-lg text-black">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.uid} className="border-b dark:border-neutral-500 hover:bg-sky-50">
                        <td className="whitespace-nowrap px-6 py-4 font-light">{user.username}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-light">{user.lastName}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-light"></td>
                        <td className="whitespace-nowrap px-6 py-4 font-light">
                          {user.score
                            ? Object.values(user.score).find((item) => item.id === `${id}`)?.score || 0
                            : 0}
                        </td>
                        <td className="whitespace-nowrap px-6  font-light">
                          {assignedUsers.length > 0
                            ? assignedUsers.includes(user.username)
                              ? <div className="px-1 py-1">Assigned</div>
                              : !user?.score
                                ? <button className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                                  onClick={() => assignQuizHandler(user.username)}>Assign</button>
                                : Object.values(user.score).map((quiz) => quiz.id).includes(id)
                                  ? <div>Resolved</div>
                                  : <button className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                                    onClick={() => assignQuizHandler(user.username)}>Assign</button>
                            : !user?.score
                              ? <button className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                                onClick={() => assignQuizHandler(user.username)}>Assign</button>
                              : Object.values(user.score).map((quiz) => quiz.id).includes(id)
                                ? <div>Resolved</div>
                                : <button className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                                  onClick={() => assignQuizHandler(user.username)}>Assign</button>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-2xl">No results found</td>
                    </tr>
                  )}
                </tbody>}
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="dark:text-zinc-200">
                Showing {indexOfFirstUser + 1}-{indexOfLastUser} of {users.length}
              </div>
              <div>
                <button
                  className="bg-blue-500 text-white  dark:bg-blue-700 dark:text-zinc-200 dark:hover:bg-blue-600 px-4 py-2 rounded mr-2 transform transition duration-500 ease-in-out hover:scale-105"
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : currentPage)
                  }
                >
                  Previous
                </button>
                <span className="dark:text-zinc-200">
                  Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
                </span>
                <button
                  className="bg-blue-500 text-white dark:bg-blue-700 dark:text-zinc-200 dark:hover:bg-blue-600 px-4 py-2 rounded ml-2 transform transition duration-500 ease-in-out hover:scale-105"
                  onClick={() =>
                    paginate(
                      currentPage < Math.ceil(users.length / usersPerPage)
                        ? currentPage + 1
                        : currentPage
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignQuiz;
