import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { FaSignOutAlt } from 'react-icons/fa';

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Signed out successfully", type: "SUCCESS" });
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const handleClick = () => {
        mutation.mutate();
    };
    
    return (
        <button
            onClick={handleClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 hover:text-blue-700 transition duration-200 flex items-center shadow-md"
        >
            Sign Out
            <FaSignOutAlt className="ml-2" />
        </button>
    );
};

export default SignOutButton;