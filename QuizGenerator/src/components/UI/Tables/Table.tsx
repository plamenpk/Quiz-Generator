import { Link } from 'react-router-dom';
import { TableTypes } from '../../../common/interfaces';

const Table = ({ quizzes, searchTerm, setSearchTerm, headCol1, headCol2, headCol3, headCol4, headCol5 }: TableTypes): JSX.Element => {

  return (
    <>
      <section className="mt-16 bg-white dark:bg-white p-4 sm:py-5 opacity-80">
        <div className="mx-auto max-w-screen-2xl lg:px-12">
          <div className="relative overflow-hidden bg-white shadow-md dark:bg-blue-300 opacity-80 sm:rounded-lg mb-20">
            <div className="overflow-x-auto">
              <div className="w-full pl-4 bg-blue-500 text-white  text-left text-gray-500 dark:text-gray-400">
                <h1 className="mb-3 text-5xl bg-clip-text dark:text-zinc-300">Quizzes</h1>
                <input
                  type="text"
                  className="focus-none p-2 text-black placeholder-black rounded mb-1 dark:bg-zinc-400 dark:placeholder-orange-200"
                  placeholder="Search for quiz ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="w-full text-left dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 bg-blue-500 text-white">{headCol1}</th>
                    <th scope="col" className="px-4 py-3 bg-blue-500 text-white text-center">{headCol2}</th>
                    <th scope="col" className="px-4 py-3 bg-blue-500 text-white">{headCol3}</th>
                    <th scope="col" className="px-4 py-3 bg-blue-500 text-white">{headCol4}</th>
                    <th scope="col" className="px-4 py-3 bg-blue-500 text-white">{headCol5}</th>
                  </tr>
                </thead>
                {quizzes.map(quiz => (
                  <tbody key={quiz.id}>
                    <tr className="border-b dark:border-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-200">
                      <th className="px-4 py-2 whitespace-nowrap dark:text-white">{quiz.title}</th>
                      <th scope="row" className="flex items-center px-4 py-2 whitespace-nowrap dark:text-white">
                        {/* <img src={img} alt="iMac Front Image" className="w-auto h-8 mr-3 scale-50"></img> */}
                        {quiz.category}
                      </th>
                      <td className="px-4 py-2 whitespace-nowrap dark:text-white">
                        <div className="flex items-center">
                          {quiz.questions?.length || 0}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center  whitespace-nowrap dark:text-white">
                        <Link to={`/quiz-scoreboard/${quiz?.id}`}>
                          {quiz.assignedUsers ? Object.keys(quiz.assignedUsers).length : 0}
                        </Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap dark:text-white">
                        <Link to={`/assign-quiz/${quiz?.id}`}
                          className="rounded-sm px-3 py-1 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-100 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
                        >Assign</Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
            <nav className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
              <span className="text-sm font-normal text-white dark:text-white">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">1000</span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">
                    <span className="sr-only">Previous</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">1</a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">2</a>
                </li>
                <li>
                  <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-indigo-700 dark:bg-indigo-600 dark:text-white">3</a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">...</a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">100</a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-indigo-600 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-200 dark:hover:text-white">
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>


    </>
  );
};

export default Table;
