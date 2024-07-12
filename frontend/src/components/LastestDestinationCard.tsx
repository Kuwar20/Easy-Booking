// import { Link } from "react-router-dom";
// import { HotelType } from "../../../backend/src/shared/types";

// type Props = {
//     hotel: HotelType;
// };

// const LatestDestinationCard = ({ hotel }: Props) => {
//     return (
//         <Link
//             to={`/detail/${hotel._id}`}
//             className="relative cursor-pointer overflow-hidden rounded-md"
//         >
//             <div className="h-[300px]">
//                 <img
//                     src={hotel.imageUrls[0]}
//                     className="w-full h-full object-cover object-center"
//                 />
//             </div>

//             <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
//                 <span className="text-white font-bold tracking-tight text-3xl">
//                     {hotel.name}
//                 </span>
//             </div>
//         </Link>
//     );
// };

// export default LatestDestinationCard;

import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
    hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
    return (
        <Link
            to={`/detail/${hotel._id}`}
            className="relative cursor-pointer overflow-hidden rounded-md block"
            style={{ minHeight: "300px" }} // Ensure a minimum height to prevent content shifting
        >
            <div className="h-[300px]">
                <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center transition duration-300 transform hover:scale-105"
                    style={{ minHeight: "300px" }} // Ensure image height matches container height
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-md">
                <span className="text-white font-bold tracking-tight text-xl sm:text-2xl md:text-3xl">
                    {hotel.name}
                </span>
            </div>
        </Link>
    );
};

export default LatestDestinationCard;
