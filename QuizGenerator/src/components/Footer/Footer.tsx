import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="relative bottom-0 left-0 z-10 w-full p-4  dark:bg-gradient-to-r dark:from-zinc-500 shadow md:flex md:items-center md:justify-between md:p-2">
        <span className="text-md  text-black sm:text-center dark:text-zinc-200">
          Copyright © 2023 by {" "}
          <a href="http://localhost:5173/" className="hover:underline">
            Quiz™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-md font-medium text-white dark:text-zinc-200 sm:mt-0">
          <li>
            <Link to="/about" className="mr-4 md:mr-6 text-black rounded-lg dark:text-zinc-200px-3 py-2 ">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className=" mr-10 text-black rounded-lg dark:text-zinc-200 dark:hover:text-orange-400 hover:bg-gradient-to-b hover:from-indigo-400 px-3 py-2">
              Contact
            </Link>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;