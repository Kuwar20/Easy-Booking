import { Link } from "react-router-dom";
import { HotelType } from "../shared/types";
import React, { useState, useEffect } from "react";

type Props = {
    hotel: HotelType;
};

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
