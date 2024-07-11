import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import Autosuggest from 'react-autosuggest';

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
    const [suggestions, setSuggestions] = useState<string[]>([]);

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
        onSuccess: async () => {
            showToast({ message: "Registration successful", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        mutation.mutate(data);
    });

    return (
        <div className='min-h-[calc(100vh-20rem)] flex flex-col justify-center'>
            <div className='bg-white sm:mx-auto sm:max-w-md sm:w-full py-8 px-4 sm:px-10 sm:rounded-md shadow'>
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
                        <input
                            type="password"
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
                        />
                        {errors.password && (
                            <span className="text-red-500">{errors.password.message}</span>
                        )}
                    </label>

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
                            className="bg-green-500 hover:bg-green-700 text-white w-full p-2 rounded-md transition-colors duration-200">Create Account</button>
                    </span>
                </form>
                <div className="mt-6">
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

export default Register