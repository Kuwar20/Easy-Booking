import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaInfoCircle, FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";

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

    return (
        <div className="min-h-[calc(100vh-25rem)] flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
            <div className="flex items-center justify-center">
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
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">
                            Email
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                        />
                        {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                        <label className="block text-sm font-bold text-gray-700">
                            Password
                            <span className="text-red-500">*</span>
                        <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className="mt-1 w-full border rounded-md px-3 py-2.5 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                        />
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
                    </div>
                    {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                    </label>
                    <div className="flex flex-col items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 bg-blue-600 text-white font-bold w-full p-2 rounded-md transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
                                }`}
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                        <div className="text-sm mt-4">
                            Not Registered?{" "}
                            <Link to="/register" className="underline text-blue-500 hover:text-black transition-colors duration-200">
                                Create an account here
                            </Link>
                        </div>
                    </div>
                </form>
                <div className="">
                    <div className="flex justify-center text-sm mb-3">
                        <p className="px-2 text-gray-800 font-semibold hover:underline cursor-pointer rounded-md">
                            or continue with
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <a
                            href="#"
                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <img
                                className="h-5 w-5"
                                src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                                alt="Facebook"
                            />
                        </a>

                        <a
                            href="#"
                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <img
                                className="h-5 w-5"
                                src="https://www.svgrepo.com/show/513008/twitter-154.svg"
                                alt="Twitter"
                            />
                        </a>

                        <a
                            href="#"
                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <img
                                className="h-6 w-6"
                                src="https://www.svgrepo.com/show/506498/google.svg"
                                alt="Google"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
