import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

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
    const { register, watch, handleSubmit, formState: { errors }, } = useForm<RegisterFormData>();

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
        mutation.mutate(data);
    });

    return (
        <form className='flex flex-col gap-5' onSubmit={onSubmit}>
            <h2 className='text-3xl font-bold'>Create an Account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-grey-700 text-sm font-bold flex-1">
                    First Name
                    <span className="text-red-500">*</span>
                    <input
                        className="border rounded w-full py-1 px-2 font-normal"
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
                        className="border rounded w-full py-1 px-2 font-normal"
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
            <label className="text-grey-700 text-sm font-bold flex-1">
                Password
                <span className="text-red-500">*</span>
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
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
                    className="border rounded w-full py-1 px-2 font-normal"
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
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Create Account</button>
            </span>
        </form>
    );
};

export default Register