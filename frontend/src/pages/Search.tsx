import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    };

    const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
        apiClient.searchHotels(searchParams)
    );

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;
        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
    };

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;
        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
                ? [...prevHotelTypes, hotelType]
                : prevHotelTypes.filter((hotel) => hotel !== hotelType)
        );
    };

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;
        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter((prevFacility) => prevFacility !== facility)
        );
    };

    return (
        <div className="grid grid-cols-1 gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
            
            {isFilterOpen && (
                <div className="bg-white shadow-md rounded-lg border border-slate-300 p-5">
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                            Filter by:
                        </h3>
                        <StarRatingFilter
                            selectedStars={selectedStars}
                            onChange={handleStarsChange}
                        />
                        <HotelTypesFilter
                            selectedHotelTypes={selectedHotelTypes}
                            onChange={handleHotelTypeChange}
                        />
                        <FacilitiesFilter
                            selectedFacilities={selectedFacilities}
                            onChange={handleFacilityChange}
                        />
                        <PriceFilter
                            selectedPrice={selectedPrice}
                            onChange={(value?: number) => setSelectedPrice(value)}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <span className="text-xl font-bold mb-2 sm:mb-0">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                        className="p-2 border rounded-md w-full sm:w-auto"
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">
                            Price Per Night (low to high)
                        </option>
                        <option value="pricePerNightDesc">
                            Price Per Night (high to low)
                        </option>
                    </select>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {hotelData?.data.map((hotel) => (
                        <SearchResultsCard key={hotel._id} hotel={hotel} />
                    ))}
                </div>
                <div className="mt-6">
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;