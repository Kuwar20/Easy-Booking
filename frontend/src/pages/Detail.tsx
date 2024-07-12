// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

// const Detail = () => {
//     const { hotelId } = useParams();

//     const { data: hotel } = useQuery(
//         "fetchHotelById",
//         () => apiClient.fetchHotelById(hotelId || ""),
//         {
//             enabled: !!hotelId,
//         }
//     );

//     if (!hotel) {
//         return <></>;
//     }

//     return (
//         <div className="space-y-6">
//             <div>
//                 <span className="flex">
//                     {Array.from({ length: hotel.starRating }).map((_, index) => (
//                         <AiFillStar key={index} className="fill-yellow-400" />
//                     ))}
//                 </span>
//                 <h1 className="text-3xl font-bold">{hotel.name}</h1>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 {hotel.imageUrls.map((image, index) => (
//                     <div key={index} className="h-[300px]">
//                         <img
//                             src={image}
//                             alt={hotel.name}
//                             className="rounded-md w-full h-full object-cover object-center"
//                         />
//                     </div>
//                 ))}
//             </div>
//             <br />
//             <label style={{ fontWeight: 'bold' }}>Amenities:</label>
//             <div className="grid grid-cols-1 text-center lg:grid-cols-4 gap-2">
//                 {hotel.facilities.map((facility, index) => (
//                     <div key={index} className="border border-slate-300 rounded-sm p-3">
//                         {facility}
//                     </div>
//                 ))}
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
//                 <div className="whitespace-pre-line">
//                     <label style={{ fontWeight: 'bold' }}>Description:</label>
//                     <br />
//                     {hotel.description}
//                 </div>
//                 <div className="h-fit">
//                     <br />
//                     <GuestInfoForm
//                         pricePerNight={hotel.pricePerNight}
//                         hotelId={hotel._id}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Detail;

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
    const { hotelId } = useParams();

    const { data: hotel } = useQuery(
        "fetchHotelById",
        () => apiClient.fetchHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );

    if (!hotel) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map((_, index) => (
                                <AiFillStar key={index} className="text-yellow-400 w-6 h-6" />
                            ))}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hotel.imageUrls.map((image, index) => (
                            <div key={index} className="h-64 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src={image}
                                    alt={`${hotel.name} - Image ${index + 1}`}
                                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {hotel.facilities.map((facility, index) => (
                                <div key={index} className="bg-gray-100 rounded-lg p-3 text-center text-sm font-medium text-gray-700">
                                    {facility}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                            <p className="text-gray-600 whitespace-pre-line">{hotel.description}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow">
                            <GuestInfoForm
                                pricePerNight={hotel.pricePerNight}
                                hotelId={hotel._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;