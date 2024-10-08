// import React, { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

// const ImageWithBlur = React.memo(({ src, alt }: { src: string; alt: string }) => {
//     const [imageLoaded, setImageLoaded] = useState(false);
//     const [blurDataUrl, setBlurDataUrl] = useState('');

//     useEffect(() => {
//         const canvas = document.createElement('canvas');
//         canvas.width = 10;
//         canvas.height = 10;
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//             const img = new Image();
//             img.crossOrigin = "Anonymous";
//             img.src = src;
//             img.onload = () => {
//                 ctx.filter = 'blur(5px)';
//                 ctx.drawImage(img, 0, 0, 10, 10);
//                 setBlurDataUrl(canvas.toDataURL());
                
//                 // Load full image after blur is ready
//                 const fullImg = new Image();
//                 fullImg.src = src;
//                 fullImg.onload = () => setImageLoaded(true);
//             };
//         }
//     }, [src]);

//     return (
//         <div className="h-64 rounded-lg overflow-hidden shadow-md relative">
//             {blurDataUrl && !imageLoaded && (
//                 <img
//                     src={blurDataUrl}
//                     alt=""
//                     className="absolute inset-0 w-full h-full object-cover object-center"
//                     style={{ filter: 'blur(20px)', transform: 'scale(1.2)' }}
//                 />
//             )}
//             <img
//                 src={src}
//                 alt={alt}
//                 className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} transform hover:scale-105 transition-transform duration-300`}
//                 loading="lazy"
//             />
//         </div>
//     );
// });

// const Detail = () => {
//     const { hotelId } = useParams();

//     const { data: hotel, isLoading } = useQuery(
//         ["fetchHotelById", hotelId],
//         () => apiClient.fetchHotelById(hotelId || ""),
//         {
//             enabled: !!hotelId,
//         }
//     );

//     if (isLoading || !hotel) {
//         return <div className="text-center py-10">Loading...</div>;
//     }

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white">
//                 <div className="p-6 space-y-6">
//                     <div className="flex items-center justify-between">
//                         <h1 className="text-3xl font-bold">{hotel.name}</h1>
//                         <span className="flex">
//                             {Array.from({ length: hotel.starRating }).map((_, index) => (
//                                 <AiFillStar key={index} className="text-yellow-400 w-6 h-6" />
//                             ))}
//                         </span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {hotel.imageUrls.map((image, index) => (
//                             <ImageWithBlur
//                                 key={index}
//                                 src={image}
//                                 alt={`${hotel.name} - Image ${index + 1}`}
//                             />
//                         ))}
//                     </div>

//                     <div>
//                         <h2 className="text-xl font-semibold mb-3">Amenities</h2>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                             {hotel.facilities.map((facility, index) => (
//                                 <div key={index} className="bg-gray-100 rounded-lg p-3 text-center text-sm font-medium text-gray-700">
//                                     {facility}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
//                         <div>
//                             <h2 className="text-xl font-semibold mb-3">Description</h2>
//                             <p className="whitespace-pre-line">{hotel.description}</p>
//                         </div>
//                         <div className="bg-gray-50 p-6 rounded-lg shadow dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border">
//                             <GuestInfoForm
//                                 pricePerNight={hotel.pricePerNight}
//                                 hotelId={hotel._id}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Detail;

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import * as apiClient from "./../api-client";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

// Skeleton loader for the image cards
const SkeletonImageCard = () => (
    <div className="animate-pulse h-64 rounded-lg bg-gray-300 shadow-md"></div>
);

const ImageWithBlur = React.memo(({ src, alt }: { src: string; alt: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [blurDataUrl, setBlurDataUrl] = useState('');

    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = src;
            img.onload = () => {
                ctx.filter = 'blur(5px)';
                ctx.drawImage(img, 0, 0, 10, 10);
                setBlurDataUrl(canvas.toDataURL());

                // Load full image after blur is ready
                const fullImg = new Image();
                fullImg.src = src;
                fullImg.onload = () => setImageLoaded(true);
            };
        }
    }, [src]);

    return (
        <div className="h-64 rounded-lg overflow-hidden shadow-md relative">
            {blurDataUrl && !imageLoaded && (
                <img
                    src={blurDataUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: 'blur(20px)', transform: 'scale(1.2)' }}
                />
            )}
            <img
                src={src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} transform hover:scale-105 transition-transform duration-300`}
                loading="lazy"
            />
        </div>
    );
});

const Detail = () => {
    const { hotelId } = useParams();

    const { data: hotel, isLoading } = useQuery(
        ["fetchHotelById", hotelId],
        () => apiClient.fetchHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );

    if (isLoading || !hotel) {
        // Show skeleton loader while the data is loading
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                    <div className="animate-pulse flex justify-between">
                        <div className="h-8 bg-gray-300 w-1/2 rounded"></div>
                        <div className="h-8 bg-gray-300 w-24 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Skeleton placeholders for images */}
                        <SkeletonImageCard />
                        <SkeletonImageCard />
                        <SkeletonImageCard />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                        <div className="h-40 bg-gray-300 rounded-lg"></div>
                        <div className="h-40 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{hotel.name}</h1>
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map((_, index) => (
                                <AiFillStar key={index} className="text-yellow-400 w-6 h-6" />
                            ))}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hotel.imageUrls.map((image, index) => (
                            <ImageWithBlur
                                key={index}
                                src={image}
                                alt={`${hotel.name} - Image ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">Amenities</h2>
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
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p className="whitespace-pre-line">{hotel.description}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border">
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
