// import { useEffect } from "react";

// type ToastProps = {
//     message: string;
//     type: "SUCCESS" | "ERROR";
//     onClose: () => void;
// };

// const Toast = ({ message, type, onClose}: ToastProps) => {
    
//     useEffect(() => {
//         const timer = setTimeout(() => {
//         onClose();
//         }, 5000);
//         return () => {
//             clearTimeout(timer);
//         };
//     },[onClose]);

//     const styles = type === "SUCCESS" 
//     ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md" 
//     : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md" ;
    
//     return(
//         <div className={styles}>
//             <div className="flex justify-center items-center">
//                 <span className="text-lg font-semibold">{message}</span>
//             </div>
//         </div>
//     );
// };
//     export default Toast;

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const getIcon = () => {
        if (type === "SUCCESS") {
            return (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`fixed top-16 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg ${
                    type === "SUCCESS" ? "bg-green-500" : "bg-red-500"
                } text-white max-w-md`}
            >
                <div className="inline-flex items-center justify-center flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 text-white hover:text-gray-200 hover:bg-gray-100/20"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;