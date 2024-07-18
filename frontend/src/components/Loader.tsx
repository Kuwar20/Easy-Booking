import LoadingIcon from '../assets/loading-twotone-loop.svg';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black">
      <img src={LoadingIcon} alt="SVG Image"/>
    </div>
  );
}

export default Loader;