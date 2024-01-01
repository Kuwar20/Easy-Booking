import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}


const SignIn = () => {

    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.singIn, {
        onSuccess: async () => {
            showToast({ message: "Sign in Successfull", type:"SUCCESS" });
        navigate("/");
        }, onError: (error: Error) => {
            showToast({message: error.message, type:"ERROR"});
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
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
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Login</button>
            </span>
        </form>
    )
};

export default SignIn;
