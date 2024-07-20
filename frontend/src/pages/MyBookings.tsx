import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
    const { data: hotels } = useQuery(
        "fetchMyBookings",
        apiClient.fetchMyBookings
    );

    if (!hotels || hotels.length === 0) {
        return <span className="dark:text-white">No bookings found</span>;
    }

    return (
        <div className="space-y-5">
            <h1 className="text-3xl font-bold dark:text-white">My Bookings</h1>
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => window.history.back()}
                >
                    Go back
                </button>
            </div>
            {hotels.map((hotel) => (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5 dark:text-white">
                    <div className="lg:w-full lg:h-[250px]">
                        <img
                            src={hotel.imageUrls[0]}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                        <div className="text-2xl font-bold">
                            {hotel.name}
                        </div>
                        <div className="text-xs font-normal">
                            {hotel.city}, {hotel.country}
                        </div>
                        <div>
                            {/* user detail that booked */}
                            <span className="font-bold mr-2">
                                Booked by:
                            </span>
                            <span>
                                {hotel.bookings[0].firstName} {hotel.bookings[0].lastName}
                            </span>

                            <span className="font-bold ml-4 mr-2">
                                Email:
                            </span>
                            <span>
                                {hotel.bookings[0].email}
                            </span>
                        </div>
                        {hotel.bookings.map((booking) => (
                            <div>
                                <div>
                                    <span className="font-bold mr-2">
                                        Dates:
                                    </span>
                                    <span>
                                        {new Date(booking.checkIn).toDateString()} -
                                        {new Date(booking.checkOut).toDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold mr-2">
                                        Guests:
                                    </span>
                                    <span>
                                        {booking.adultCount} adults, {booking.childCount} children
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold mr-2">
                                        Total Amount:
                                    </span>
                                    <span>
                                    ₹ {hotel.bookings[0].totalCost}
                                    </span>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyBookings;