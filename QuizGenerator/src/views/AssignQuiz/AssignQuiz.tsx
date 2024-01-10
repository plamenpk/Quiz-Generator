import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.services";
import { quizAssignments, getQuizById } from "../../services/quiz.services";
import toast from "react-hot-toast";
import { searchUser } from "../../services/admin.services";


const AssignQuiz = () => {

  const { id } = useParams();
  const [date, setDate] = useState('');
  const [finalDate, setFinalDate] = useState('')
  const [users, setUsers] = useState([]);
  const [quiz, setQuiz] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [result, setResult] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then(snapshot => {
        setUsers(Object.values(snapshot.val()))
      })
      .catch(e => toast.error(e));
  }, []);

  useEffect(() => {
    getQuizById(id)
      .then(snapshot => {
        snapshot.assignedUsers ?
          setAssignedUsers(Object.keys(snapshot.assignedUsers))
          : assignedUsers
        setQuiz(snapshot)
      })
      .catch(e => toast.error(e));
  }, [id, assignedUsers]);

  const assignQuizHandler = (user) => {

    const chosenDate = new Date(date);
    const dateInSeconds = chosenDate.getTime();
    const chosenFinalDate = new Date(finalDate);
    const finalDateInSeconds = chosenFinalDate.getTime();
    if (dateInSeconds === '' || finalDateInSeconds === '') {
      toast.error('date and finalDate can\'t be empty');
      return;
    }

    if (!dateInSeconds) {
      toast.error('date and finalDate cant\'be empty');
    }
    if (!finalDateInSeconds) {
      toast.error('date and finalDate cant\'be empty');
    }

    quizAssignments(user, id, dateInSeconds, finalDateInSeconds)
      .then(() => {
        toast.success('quiz assigned successfully')
      })
      .catch(e => console.error(e));
  }

  useEffect(() => {
    searchUser("").then(setResult);
    const timer = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 90);

    return () => clearInterval(timer);
  }, [setResult]);

  const filteredUsers = result.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="h-screen  pb-20 overflow-auto p-5">
        <div className="mt-20 justify-center items-center border-4 p-10 rounded-lg bg-gradient-to-bl from-indigo-400 dark:from-zinc-600">
          <div className=" flex flex-col ">

            <div className=" text-sm text-black flex items-center justify-end dark:text-zinc-200">
              <span className="flex-grow text-xl mb-5"> <span className="text-2xl font-bold">Quiz Title: </span>{quiz?.title}</span>
              <div className="ml-10 mt-14">
                Open from <input
                  className="rounded-sm dark:bg-zinc-400"
                  type="datetime-local"
                  placeholder="date"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="ml-10 mt-14">
                Closed on <input
                  className="rounded-sm dark:bg-zinc-400"
                  type="datetime-local"
                  onChange={(e) => setFinalDate(e.target.value)}
                />
              </div>
            </div><input
              type="text"
              className="border p-2 rounded w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 placeholder-orange-300 dark:bg-zinc-400 dark:placeholder-orange-200 font-bold"
              placeholder="Search for user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 ">
            <table className="table-auto rounded w-full text-center text-white dark:text-zinc-200">
              <thead className=" text-lg border dark:bg-gradient-to-br dark:from-zinc-600">
                <tr>
                  <th className=" px-4 py-2">Username</th>
                  <th className=" px-4 py-2">Last Name</th>
                  <th className=" px-4 py-2"></th>
                  <th className=" px-4 py-2">Points</th>
                  <th className=" px-4 py-2 flex flex-row space-x-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="border dark:bg-gradient-to-br dark:from-zinc-800">
                      <td className=" px-4 py-2">{user.username}</td>
                      <td className=" px-4 py-2">{user.lastName}</td>
                      <td className=" px-4 py-2"></td>
                      <td className=" px-4 py-2">
                        {user.score ? Object.values(user?.score).find(item => item.id === `${id}`)
                          ? Object.values(user?.score).find(item => item.id === `${id}`).score : 0 : 0
                        }</td>
                      <td className=" px-4 py-2">
                        {assignedUsers.length > 0
                          ? assignedUsers.includes(user.username)
                            ? <button >Assigned</button>
                            : !user?.score ? <button onClick={() => assignQuizHandler(user.username)}>Assign</button> :
                              Object.values(user.score).map((quiz) => quiz.id).includes(id)
                                ? <button >Resolved</button>
                                : <button onClick={() => assignQuizHandler(user.username)}>Assign</button>
                          : !user?.score ? <button onClick={() => assignQuizHandler(user.username)}>Assign</button> :
                            Object.values(user.score).map((quiz) => quiz.id).includes(id)
                              ? <button >Resolved</button>
                              : <button onClick={() => assignQuizHandler(user.username)}>Assign</button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-2xl">No results found</td>
                  </tr>
                )}
              </tbody>
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
    </>
  )
}

export default AssignQuiz
