import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SetStateAction, useState } from "react";
import { FaInfoCircle, FaCopy } from 'react-icons/fa';


export type SignInFormData = {
    email: string;
    password: string;
};

const SignIn = () => {
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const location = useLocation();
    const [isPopoverVisible, setPopoverVisible] = useState(false);
    const [isEmailCopied, setIsEmailCopied] = useState(false);
    const [isPasswordCopied, setIsPasswordCopied] = useState(false);
    const handleCopy = (text: string, setIsCopiedCallback: { (value: SetStateAction<boolean>): void; (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopiedCallback(true);
            setTimeout(() => setIsCopiedCallback(false), 2000); // Reset the copy state after 2 seconds
        });
    };


    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({ message: "Sign in Successful!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <div className="flex items-center">
                <h2 className="text-3xl font-bold">Sign In</h2>
                <div
                    className="text-blue-500 cursor-pointer ml-2 p-1 rounded-full border border-blue-500"
                    onClick={() => setPopoverVisible(!isPopoverVisible)}
                >
                    <FaInfoCircle size={20} />
                </div>
                {isPopoverVisible && (
                    <div className="ml-2 p-2 bg-white border rounded shadow">
                        <p>New here? No worries! Skip the hassle of creating an account and take a quick tour with our test credentials.</p>
                        <div className="flex items-center">
                            <p>Email: <span className="text-blue-700">Hirehim@gmail.com</span></p>
                            <span className="ml-3 text-blue-500">{isEmailCopied ? 'Copied!' : <FaCopy onClick={() => handleCopy('Hirehim@gmail.com', setIsEmailCopied)} />}</span>
                        </div>
                        <div className="flex items-center">
                            <p>Password: <span className="text-blue-700">Stronghire1@</span></p>
                            <span className="ml-9 text-blue-500">{isPasswordCopied ? 'Copied!' : <FaCopy onClick={() => handleCopy('Stronghire1@', setIsPasswordCopied)} />}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* Email */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <span className="text-red-500">*</span>
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>

            {/* Password */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <span className="text-red-500">*</span>
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>

            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered?{" "}
                    <Link className="underline text-blue-500" to="/register">
                        Create an account here
                    </Link>
                </span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
                >
                    Login
                </button>
            </span>
        </form>
    );
};

export default SignIn;