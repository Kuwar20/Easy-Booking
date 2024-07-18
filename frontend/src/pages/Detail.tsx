import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const ImageWithBlur = React.memo(({ src, alt }: { src: string; alt: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [blurDataUrl, setBlurDataUrl] = useState('');

    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.filter = 'blur(5px)';
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = src;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 10, 10);
                setBlurDataUrl(canvas.toDataURL());
            };
        }

        const fullImg = new Image();
        fullImg.src = src;
        fullImg.onload = () => setImageLoaded(true);
    }, [src]);

    return (
        <div className="h-64 rounded-lg overflow-hidden shadow-md relative">
            {blurDataUrl && (
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
        return <div className="text-center py-10">Loading...</div>;
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
                    <div className="bg-gray-50 p-6 rounded-lg shadow dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border">
                        <GuestInfoForm
                            pricePerNight={hotel.pricePerNight}
                            hotelId={hotel._id}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Detail;