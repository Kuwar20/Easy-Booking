const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black">
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
};

export default Loader;
