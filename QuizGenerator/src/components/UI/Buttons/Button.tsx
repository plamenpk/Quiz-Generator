import { ButtonType } from '../../../common/interfaces';

const Button = (props: ButtonType): JSX.Element => {
  
  return (
    <button
      type={props.buttonType}
      onClick={props.onClickFunction}
      className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
    >
      {props.text}
    </button>
  );
};

export default Button;
