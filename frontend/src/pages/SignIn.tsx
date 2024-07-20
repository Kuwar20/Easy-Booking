import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaInfoCircle, FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// console.log(googleClientId);
// console.log(API_BASE_URL); 

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
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        formState: { errors },
        watch,
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
        onMutate: () => {
            setLoading(true);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const getLoginButtonMessage = () => {
        if (loading) return 'Loading...';
        if (!watch("email")) return 'Login';
        if (!watch("password")) return 'Password is required';
        return 'Login';
    };

    const isLoginButtonDisabled = () => {
        return (
            loading ||
            !watch("email") ||
            !watch("password")
        );
    };

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        mutation.mutate(data);
    });

    const handleCopy = (text: string, setIsCopiedCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopiedCallback(true);
            setTimeout(() => setIsCopiedCallback(false), 2000); // Reset the copy state after 2 seconds
        });
    };
    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google login failed');
            }

            showToast({ message: "Google login successful", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        } catch (error: any) {
            showToast({ message: error.message, type: "ERROR" });
        }
    };

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="min-h-[calc(100vh-25rem)] flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white border">
                    <div className="flex items-center justify-center">
                        <h2 className="text-3xl font-bold">Sign In</h2>
                        <div
                            className="text-blue-500 cursor-pointer ml-2 p-1 rounded-full border border-blue-500"
                            onClick={() => setPopoverVisible(!isPopoverVisible)}
                        >
                            <FaInfoCircle size={20} />
                        </div>

                        {isPopoverVisible && (
                            <div className="ml-2 p-2 bg-white border rounded shadow  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white">
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
                    <form className="mt-8 space-y-6  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white bor" onSubmit={onSubmit}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold">
                                Email
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "" })}
                                className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                            />
                            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <label className="block text-sm font-bold">
                            Password
                            <span className="text-red-500">*</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className="mt-1 w-full border rounded-md px-3 py-2.5 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                                />
                                {watch("password") && (
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >

                                        {showPassword ? (
                                            <FaEye className="h-5 w-5 text-gray-700" />
                                        ) : (
                                            <FaEyeSlash className="h-5 w-5 text-gray-700" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                        </label>
                        <div className="flex flex-col items-center justify-between">
                            <button
                                type="submit"
                                disabled={isLoginButtonDisabled()}
                                className={`mt-2 bg-blue-600 text-white font-bold w-full p-2.5 rounded-md transition-colors duration-200 
        ${isLoginButtonDisabled() ? "opacity-60" : "hover:bg-blue-500"}`}
                            >
                                {getLoginButtonMessage()}
                            </button>
                            <div className="text-sm mt-4">
                                Not Registered?{" "}
                                <Link to="/register" className="underline text-blue-500 hover:text-black transition-colors duration-200">
                                    Create an account here
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="mt-4 flex items-center justify-center gap-2">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    showToast({ message: "Google login failed", type: "ERROR" });
                                }}
                            />
                        <a
                            href="#"
                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                        >
                            <img
                                className="h-5 w-5"
                                src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                                alt="Facebook"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default SignIn;
