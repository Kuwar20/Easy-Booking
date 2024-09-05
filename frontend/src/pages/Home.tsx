import { useMemo } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";

// Skeleton loader component
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

const Home: React.FC = () => {
    const { data: hotels, isLoading } = useQuery("fetchQuery", () =>
        apiClient.fetchHotels()
    );

    const topRowHotels = useMemo(() => hotels?.slice(0, 2) || [], [hotels]);
    const bottomRowHotels = useMemo(() => hotels?.slice(2) || [], [hotels]);

    return (
        <div className="max-w-6xl mx-auto px-3 py-2 dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white">
            <div className="text-center mb-6">
                <h2 className="text-4xl font-bold mb-2">Latest Destinations</h2>
                <p className="text-xl">Most recent destinations added by our hosts</p>
            </div>
            <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {isLoading
                        ? Array(2)
                            .fill(0)
                            .map((_, index) => <SkeletonCard key={index} />)
                        : topRowHotels.map((hotel, index) => (
                            <div
                                key={index}
                                className="transform transition duration-500 hover:scale-105"
                            >
                                <LatestDestinationCard hotel={hotel} />
                            </div>
                        ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {isLoading
                        ? Array(3)
                            .fill(0)
                            .map((_, index) => <SkeletonCard key={index} />)
                        : bottomRowHotels.map((hotel, index) => (
                            <div
                                key={index}
                                className="transform transition duration-500 hover:scale-105"
                            >
                                <LatestDestinationCard hotel={hotel} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
