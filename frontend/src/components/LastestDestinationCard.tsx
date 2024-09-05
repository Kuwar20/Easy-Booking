// import { Link } from "react-router-dom";
// import { HotelType } from "../shared/types";
// import React, { useState, useEffect } from "react";

// type Props = {
//     hotel: HotelType;
// };

// const LatestDestinationCard = React.memo(({ hotel }: Props) => {
//     const [imageLoaded, setImageLoaded] = useState(false);
//     const [blurDataUrl, setBlurDataUrl] = useState('');

//     useEffect(() => {
//         // Generate a low-quality placeholder
//         const canvas = document.createElement('canvas');
//         canvas.width = 10;
//         canvas.height = 10;
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//             const img = new Image();
//             img.crossOrigin = "Anonymous";
//             img.src = hotel.imageUrls[0];
//             img.onload = () => {
//                 ctx.drawImage(img, 0, 0, 10, 10);
//                 setBlurDataUrl(canvas.toDataURL());
//             };
//         }

//         // Preload the full-quality image
//         const fullImg = new Image();
//         fullImg.src = hotel.imageUrls[0];
//         fullImg.onload = () => setImageLoaded(true);
//     }, [hotel.imageUrls]);

//     return (
//         <Link
//             to={`/detail/${hotel._id}`}
//             className="relative cursor-pointer overflow-hidden rounded-md block border border-gray-200 shadow-md hover:shadow-lg transition duration-300"
//             style={{ minHeight: "300px" }}
//         >
//             <div className="h-[300px] relative">
//                 {blurDataUrl && (
//                     <img
//                         src={blurDataUrl}
//                         alt=""
//                         className="absolute inset-0 w-full h-full object-cover object-center"
//                         style={{ filter: 'blur(20px)', transform: 'scale(1.2)' }}
//                     />
//                 )}
//                 <img
//                     src={hotel.imageUrls[0]}
//                     alt={hotel.name}
//                     className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//                     loading="lazy"
//                 />
//             </div>
            
//             <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-md">
//                 <span className="text-white font-bold tracking-tight text-xl sm:text-2xl md:text-3xl">
//                     {hotel.name}
//                 </span>
//             </div>
//         </Link>
//     );
// });

// export default LatestDestinationCard;

import { Link } from "react-router-dom";
import { HotelType } from "../shared/types";
import React, { useState, useEffect } from "react";

type Props = {
    hotel: HotelType;
};

const SkeletonCard = () => (
    <div className="animate-pulse border border-gray-300 rounded-lg overflow-hidden shadow-lg h-[300px] flex flex-col">
        {/* Image placeholder */}
        <div className="h-48 bg-gray-200"></div>
        
        {/* Content placeholder */}
        <div className="flex-1 p-4 space-y-4 bg-white">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-full"></div>

            {/* Description */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);
// const SkeletonCard = () => (
//     <div className="animate-pulse border border-gray-300 rounded-lg overflow-hidden shadow-lg h-[300px]">
//         <div className="h-full bg-gray-200"></div>
//         <div className="p-4 bg-gray-300">
//             <div className="h-6 bg-gray-200 mb-2 rounded"></div>
//             <div className="h-4 bg-gray-200 mb-1 rounded"></div>
//         </div>
//     </div>
// );

const LatestDestinationCard = React.memo(({ hotel }: Props) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [blurDataUrl, setBlurDataUrl] = useState('');

    useEffect(() => {
        // Generate a low-quality placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = hotel.imageUrls[0];
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 10, 10);
                setBlurDataUrl(canvas.toDataURL());
            };
        }

        // Preload the full-quality image
        const fullImg = new Image();
        fullImg.src = hotel.imageUrls[0];
        fullImg.onload = () => setImageLoaded(true);
    }, [hotel.imageUrls]);

    if (!imageLoaded && !blurDataUrl) {
        // Show skeleton while the image is loading
        return <SkeletonCard />;
    }

    return (
        <Link
            to={`/detail/${hotel._id}`}
            className="relative cursor-pointer overflow-hidden rounded-md block border border-gray-200 shadow-md hover:shadow-lg transition duration-300"
            style={{ minHeight: "300px" }}
        >
            <div className="h-[300px] relative">
                {blurDataUrl && (
                    <img
                        src={blurDataUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ filter: 'blur(20px)', transform: 'scale(1.2)' }}
                    />
                )}
                <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-md">
                <span className="text-white font-bold tracking-tight text-xl sm:text-2xl md:text-3xl">
                    {hotel.name}
                </span>
            </div>
        </Link>
    );
});

export default LatestDestinationCard;
