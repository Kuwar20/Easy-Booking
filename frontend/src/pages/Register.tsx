import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client"

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {

    const { register, watch, handleSubmit, formState: { errors }, } = useForm<RegisterFormData>();

    const mutation = useMutation(apiClient.register, {
        onSuccess: () => {
            alert("Account created successfully");
        },
        onError: (error: Error) => {
            alert(error.message);
        },
    })

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className='flex flex-col gap-5' onSubmit={onSubmit}>
            <h2 className='text-3xl font-bold'>Create an Account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-grey-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                        {...register("firstName", { required: "This field is required" })}>
                    </input>
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="text-grey-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                        {...register("lastName", { required: "This field is required" })}>
                    </input>
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            <label className="text-grey-700 text-sm font-bold flex-1">
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is required" })}>
                </input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="text-grey-700 text-sm font-bold flex-1">
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        validate: (value) => {
                            const email = watch("email");
                            const hasUppercase = /[A-Z]/.test(value);
                            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                            const isNotEqualEmail = value !== email;

                            if (!hasUppercase) {
                                return "Password must contain at least 1 uppercase letter";
                            }
                            if (!hasSpecialChar) {
                                return "Password must contain at least 1 special character";
                            }
                            if (!isNotEqualEmail) {
                                return "Password must not be equal to email";
                            }
                            return true;
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <label className="text-grey-700 text-sm font-bold flex-1">
                Confirm Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate: (value) => {
                            if (!value) {
                                return "This field is required"
                            } else if (watch("password") !== value) {
                                return "Passwords do not match"
                            }
                        },
                    })}>
                </input>
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