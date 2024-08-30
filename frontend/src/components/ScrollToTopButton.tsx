import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            {visible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
