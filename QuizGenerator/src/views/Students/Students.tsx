import { useState, useEffect, useContext } from 'react';
import { blockUser, searchUser } from '../../services/users.services';
import { ROLE_CHECK } from '../../common/constants';
import { AuthContext } from '../../context/AuthContext';
import { totalScore } from '../../common/helpers';
import { UserData } from '../../common/interfaces';

const Students: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [blockedUsers, setBlockedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { appState } = useContext(AuthContext);
  const educatorName = appState?.userData?.firstName;
  const [index, setIndex] = useState(0);
  const text = `Teacher ${educatorName}! `;

  useEffect(() => {
    searchUser('').then(setUsers);
    const timer = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 90);

    return () => clearInterval(timer);
  }, [setUsers]);

  const handleBlockUser = (username: string, blockStatus: boolean): void => {
    const newBlockStatus = !blockStatus;

    // setBlockedUsers((prevState) => ({
    //   ...prevState,
    //   [username]: newBlockStatus,
    // }));

    blockUser(username, newBlockStatus).then(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username
            ? { ...user, isBlocked: newBlockStatus }
            : user
        )
      );
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <div className="">
      <div className="mt-10 mb-16 py-8 px-2 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="bg-white rounded shadow-lg p-4 md:p-8">
            <div className="flex flex-col items-center">
              <h1 className=" mt-5 text-zinc-700 dark:text-zinc-300 text-4xl font-bold">
                {' '}
                Hello,{' '}
                {text
                  .slice(0, index)
                  .split('')
                  .map((char, i) => (
                    <span
                      key={i}
                      className="animate-gradient bg-clip-text text-transparent bg-indigo-400"
                    >
                      {char}
                    </span>
                  ))}
              </h1>
              <p className="pt-8 text-3xl font-semibold bg-clip-text p-1 text-transparent bg-gradient-to-r from-zinc-700 to-gray-500 dark:bg-gradient-to-r dark:from-zinc-300 dark:to-gray-500">
                Welcome to the students’ page.
                <p className="mt-2">
                  Here, on this table, you will see all the students.
                </p>
                <p className=" mt-2">
                  In the search field, you can look for a specific student.
                </p>
                <p className=" mt-2">
                  Enjoy the convenience and efficiency of our system!
                </p>
              </p>
            </div>

            <div>
              <h1 className="my-5 text-3xl dark:text-zinc-200">Students</h1>
              <input
                type="text"
                className="border p-2 rounded w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 dark:bg-zinc-400 hover:bg-sky-50"
                placeholder="Search for user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <table className="min-w-full text-left font-light">
                <thead className="border-b dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-2">Username</th>
                    <th scope="col" className="px-6 py-2">Email</th>
                    <th scope="col" className="px-6 py-2">Points</th>
                    <th scope="col" className="px-6 py-2">Finished quizzes</th>
                    <th scope="col" className="px-6 py-2">Block</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(
                      (user) =>
                        user.role === ROLE_CHECK.STUDENT && (
                          <tr
                            key={user.username}
                            className="border-b dark:border-neutral-500 hover:bg-sky-50"
                          >
                            <td className="whitespace-nowrap px-6 py-2 font-light">{user.username}</td>
                            <td className="whitespace-nowrap px-6 py-2 font-light">{user.email}</td>
                            <td className="whitespace-nowrap px-6 py-2 font-light">
                              {user.score ? totalScore(Object.values(user.score)) : 0}
                            </td>
                            <td className="whitespace-nowrap px-6 py-2 font-light">
                              {user.score ? Object.values(user.score).length : 0}
                            </td>
                            <td className="whitespace-nowrap px-6 py-2 font-light">
                              <button
                                className={`${user.isBlocked
                                  ? 'bg-green-500 dark:bg-green-700 dark:hover:bg-green-600'
                                  : 'bg-red-500 dark:bg-red-700 dark:hover:bg-red-600'
                                  } text-white dark:text-zinc-100 px-4 py-2 rounded transform transition duration-500 ease-in-out hover:scale-105 `}
                                onClick={() =>
                                  handleBlockUser(user.username, user.isBlocked)
                                }
                              >
                                {user.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            </td>
                          </tr>
                        )
                    )
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-2xl">No results found</td>
                    </tr>
                  )
                  }
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4 dark:text-zinc-100">
                <div>
                  Showing {indexOfFirstUser + 1}-{indexOfLastUser} of {users.length}
                </div>
                <div>
                  <button
                    className="bg-blue-700 text-white dark:text-zinc-100 dark:hover:bg-blue-600 px-4 py-2 rounded mr-2 transform transition duration-500 ease-in-out hover:scale-105"
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : currentPage)
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
                  </span>
                  <button
                    className="bg-blue-700 text-white dark:text-zinc-100 dark:hover:bg-blue-600 px-4 py-2 rounded ml-2 transform transition duration-500 ease-in-out hover:scale-105"
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
      </div>
    </div>
  );
};

export default Students;
