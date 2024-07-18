import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormData>();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [passwordStrength, setPasswordStrength] = useState({
        strength: 0,
        label: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const checkPasswordStrength = (password: any) => {
        let strength = 0;
        if (password.length >= 8) strength += 2;
        if (password.length > 12) strength += 1;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[$@#&!]+/)) strength += 1;

        let strengthLabel = "Weak";
        if (strength > 3) strengthLabel = "Moderate";
        if (strength > 5) strengthLabel = "Strong";

        return { strength, label: strengthLabel };
    };

    const onEmailChange = (_event: any, { newValue }: any) => {
        setEmail(newValue);
        setValue('email', newValue, { shouldValidate: true });
    };

    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const emailProviders = ['gmail.com', 'icloud.com', 'yahoo.com', 'outlook.com',];

        return inputLength === 0 ? [] : emailProviders.map(provider => `${inputValue}@${provider}`);
    };

    const renderSuggestion = (suggestion: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => (
        <div>
            {suggestion}
        </div>
    );

    const mutation = useMutation(apiClient.register, {
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: async () => {
            setIsLoading(false);
            showToast({ message: "Registration successful", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            setIsLoading(false);
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        mutation.mutate(data);
    });

    return (
        <div className="min-h-[calc(100vh-25rem)] flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white border">
            <form className='flex flex-col gap-5' onSubmit={onSubmit}>
                    <h2 className='mb-1 text-3xl font-bold text-center'>Create an Account</h2>
                    <div className="flex flex-col md:flex-row gap-5">
                        <label className="text-grey-700 text-sm font-bold flex-1">
                            First Name
                            <span className="text-red-500">*</span>
                            <input
                                className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && (
                                <span className="text-red-500">{errors.firstName.message}</span>
                            )}
                        </label>
                        <label className="text-grey-700 text-sm font-bold flex-1">
                            Last Name
                            <span className="text-red-500">*</span>
                            <input
                                className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                                {...register("lastName", {
                                    required: "Last name is required",
                                    validate: (value) => {
                                        const firstName = watch("firstName");
                                        if (firstName === value) {
                                            return "First name and last name cannot be the same";
                                        }
                                        return true;
                                    },
                                })}
                            />
                            {errors.lastName && (
                                <span className="text-red-500">{errors.lastName.message}</span>
                            )}
                        </label>
                    </div>
                    <label className="text-grey-700 text-sm font-bold flex-1">
                        Email
                        <span className="text-red-500">*</span>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={({ value }) => setSuggestions(getSuggestions(value))}
                            onSuggestionsClearRequested={() => setSuggestions([])}
                            getSuggestionValue={suggestion => suggestion}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: 'Email',
                                value: email,
                                onChange: onEmailChange,
                                className: "mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                            }}
                        />
                        {errors.email && (
                            <span className="text-red-500">{errors.email.message}</span>
                        )}
                    </label>
                    {/* Password */}
                    <label className="text-grey-700 text-sm font-bold flex-1">
                        Password
                        <span className="text-red-500">*</span>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                    validate: (value) => {
                                        const email = watch("email");
                                        const hasUppercase = /[A-Z]/.test(value);
                                        const hasLowercase = /[a-z]/.test(value);
                                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                                        const isNotEqualEmail = value !== email;
                                        const hasNumber = /\d/.test(value);

                                        if (!hasUppercase) {
                                            return "Password must contain at least 1 uppercase letter";
                                        }
                                        if (!hasLowercase) {
                                            return "Password must contain at least 1 lowercase letter";
                                        }
                                        if (!hasSpecialChar) {
                                            return "Password must contain at least 1 special character";
                                        }
                                        if (!isNotEqualEmail) {
                                            return "Password must not be equal to email";
                                        }
                                        if (!hasNumber) {
                                            return "Password must contain at least 1 number";
                                        }
                                        return true;
                                    },
                                })}
                                onChange={(e) => {
                                    setPasswordStrength(checkPasswordStrength(e.target.value));
                                    register("password").onChange(e); // This ensures react-hook-form's onChange still runs
                                }}
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {watch("password") && showPassword ? (
                                    <FaEye className="h-5 w-5 text-gray-700" />
                                ) : (
                                    <FaEyeSlash className="h-5 w-5 text-gray-700" />
                                )}
                            </div>
                        </div>
                        {errors.password && (
                            <span className="text-red-500">{errors.password.message}</span>
                        )}
                    </label>
                    {watch("password") && (
                        <div className="mt-1">
                            <div className="w-1/2 bg-gray-200 rounded-full h-1">
                                <div
                                    className={`h-1 rounded-full ${passwordStrength.label === "Weak"
                                        ? "bg-red-500"
                                        : passwordStrength.label === "Moderate"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                        }`}
                                    style={{
                                        width: `${(passwordStrength.strength / 7) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="w-1/2 flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Weak</span>
                                <span className="text-xs text-gray-500">Strong</span>
                            </div>
                        </div>
                    )}
                    {/* Confirm Password */}
                    <label className="text-grey-700 text-sm font-bold flex-1">
                        Confirm Password
                        <span className="text-red-500">*</span>
                        <input
                            type="password"
                            className="mt-1 w-full border rounded-md px-3 py-2 placeholder-gray-500 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-900"
                            {...register("confirmPassword", {
                                validate: (value) => {
                                    if (!value) {
                                        return "Password is required";
                                    } else if (watch("password") !== value) {
                                        return "Passwords do not match";
                                    }
                                },
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500">{errors.confirmPassword.message}</span>
                        )}
                    </label>
                    <span>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full p-2.5 rounded-md transition-colors duration-200 ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white font-bold'
                                }`}
                        >
                            {isLoading ? 'Loading...' : 'Create Account'}
                        </button>
                    </span>
                </form>
                <div className="mt-6">
                    <div className="flex justify-center text-sm mb-3">
                        <p className="px-2 text-gray-500 font-semibold hover:underline cursor-pointer rounded-md">
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

export default Register