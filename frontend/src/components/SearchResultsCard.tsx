import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";

type Props = {
    hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
    return (
        <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <div className="w-full h-[200px]">
                <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center rounded-lg"
                />
            </div>
            <div className="flex flex-col justify-between flex-grow mt-4">
                <div>
                    <div className="flex items-center mb-2">
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }, (_, index) => (
                                <AiFillStar key={index} className="fill-yellow-400 w-5 h-5" />
                            ))}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">{hotel.type}</span>
                    </div>
                    <Link
                        to={`/detail/${hotel._id}`}
                        className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        {hotel.name}
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {hotel.description}
                    </p>
                </div>

                <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {hotel.facilities.slice(0, 3).map((facility, index) => (
                            <span 
                                key={`facility-${index}`} 
                                className="bg-slate-200 px-2 py-1 rounded-full text-xs font-semibold text-gray-700"
                            >
                                {facility}
                            </span>
                        ))}
                        {hotel.facilities.length > 3 && (
                            <span className="text-xs text-gray-600">
                                +{hotel.facilities.length - 3} more
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-lg text-gray-800">
                            ₹{hotel.pricePerNight} per night
                        </span>
                        <Link
                            to={`/detail/${hotel._id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsCard;