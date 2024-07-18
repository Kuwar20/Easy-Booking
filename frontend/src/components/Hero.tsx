const Hero = () => {
    return (
        <div className="bg-blue-700 pb-8 md:pb-16 dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border-b border-white dark:border-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 sm:mb-4 ">
                        Find your next destination
                    </h1>
                    <p className="text-md sm:text-xl text-white">
                        Search Low Cost Hotels at your favorite destination
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hero;