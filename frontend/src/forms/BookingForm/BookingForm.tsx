import { useForm } from "react-hook-form";
import {
    PaymentIntentResponse,
    UserType,
} from "../../shared/types";
import { CardElement } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const search = useSearchContext();
    const { hotelId } = useParams();

    const { showToast } = useAppContext();
    const navigate = useNavigate();

    const { mutate: bookRoom, isLoading } = useMutation(
        apiClient.createRoomBooking,
        {
            onSuccess: () => {
                showToast({ message: "Booking Saved!", type: "SUCCESS" });
                setTimeout(() => {
                    navigate("/my-bookings");
                }, 1500);
            },
            onError: () => {
                showToast({ message: "Error saving booking", type: "ERROR" });
            },
        }
    );

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
        },
    });

    const onSubmit = async (formData: BookingFormData) => {
        // Simulate a successful payment
        const simulatedPaymentIntent = {
            id: 'simulated_' + Date.now(),
            status: 'succeeded'
        };

        // Add the simulated payment intent ID to the form data
        const bookingData = {
            ...formData,
            paymentIntentId: simulatedPaymentIntent.id
        };

        // Call the booking mutation with the updated data
        bookRoom(bookingData);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
        >
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("firstName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Your Price Summary</h2>

                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">&nbsp;Includes taxes and charges</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                    Payment Details <span className="text-red-500">*</span>
                </h3>
                <CardElement
                    id="payment-element"
                    className="border rounded-md p-2 text-sm"
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    hidden={!paymentIntent.clientSecret}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>
        </form>
    );
};

export default BookingForm;