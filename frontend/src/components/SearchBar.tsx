import React, { FormEvent, useState, useRef } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useMutation } from "react-query";
import * as apiClient from "../api-client";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);
    const inputRef = useRef<HTMLInputElement>(null);

    // const { mutate: searchMutation } = useMutation(apiClient.searchHotelSuggestions, {
    //     onSuccess: (data: any) => {
    //         console.log('API response:', data);
    //         if (data.length > 0) {
    //             const matchingSuggestions = data
    //                 .filter((hotel: { name: string; city: string; country: string; }) =>
    //                     hotel.name.toLowerCase().includes(destination.toLowerCase()) ||
    //                     hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
    //                     hotel.country.toLowerCase().includes(destination.toLowerCase())
    //                 )
    //                 .map((hotel: { name: string; city: string; country: any; }) => {
    //                     if (hotel.name.toLowerCase().includes(destination.toLowerCase())) {
    //                         return hotel.name;
    //                     } else if (hotel.city.toLowerCase().includes(destination.toLowerCase())) {
    //                         return `${hotel.city}, ${hotel.country}`;
    //                     } else {
    //                         return hotel.country;
    //                     }
    //                 });
    //                 console.log('Matching suggestions:', matchingSuggestions);
    //             setSuggestions([...new Set(matchingSuggestions as string[])]);
    //         } else {
    //             setSuggestions([]);
    //         }
    //     },
    //     onError: (error: Error) => {
    //         console.error("Error fetching suggestions:", error);
    //         console.log('Error fetching suggestions:', error);
    //         setSuggestions([]);
    //     }
    // });
    const { mutate: searchMutation } = useMutation(apiClient.searchHotelSuggestions, {
        onSuccess: (data: any) => {
            console.log('API response:', data);
            if (data.length > 0) {
                const matchingSuggestions = data
                    .filter((hotel: { name: string; city: string; country: string; }) =>
                        hotel.name.toLowerCase().includes(destination.toLowerCase()) ||
                        hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
                        hotel.country.toLowerCase().includes(destination.toLowerCase())
                    )
                    .map((hotel: { name: string; city: string; country: any; }) => {
                        if (hotel.name.toLowerCase().includes(destination.toLowerCase())) {
                            return hotel.name;
                        } else if (hotel.city.toLowerCase().includes(destination.toLowerCase())) {
                            return `${hotel.city}, ${hotel.country}`;
                        } else {
                            return hotel.country;
                        }
                    });
                console.log('Matching suggestions:', matchingSuggestions);
                setSuggestions([...new Set(matchingSuggestions as string[])]);
            } else {
                setSuggestions([]);
            }
        },
        onError: (error: any) => {
            console.error("Error fetching suggestions:", error);
    
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('Request data:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error message:', error.message);
            }
            
            console.log('Error config:', error.config);
            setSuggestions([]);
        }
    });
    
    const handleSearchInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setDestination(value);

        if (value.length >= 2) {
            try {
                searchMutation(value);
                console.log('Fetching suggestions for:', value);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowRight' && suggestions.length > 0) {
            setDestination(suggestions[0]);
            setSuggestions([]);
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);
        navigate("/search");
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
        <button className="w-full min-w-0 bg-white p-2 focus:outline-none flex items-center" onClick={onClick} ref={ref}>
            <FaRegCalendarAlt className="mr-2" style={{ fontSize: '20px', marginRight: '10px' }} />
            {value}
        </button>
    ));

    return (
        <form
            onSubmit={handleSubmit}
            className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4 dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border border-gray-200 dark:border-white"        >
            <div className="flex flex-row items-center flex-1 bg-white p-2 relative">
                <MdTravelExplore size={25} className="mr-2" />
                <div className="relative w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Where are you going?"
                        className="text-md w-full focus:outline-none"
                        value={destination}
                        spellCheck="false"
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    {suggestions.length > 0 && destination.length > 0 && (
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <span className="text-transparent">{destination}</span>
                            <span className="text-gray-400">
                                {suggestions[0].slice(suggestions[0].toLowerCase().indexOf(destination.toLowerCase()) + destination.length)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        value={adultCount}
                        onChange={(event) => setAdultCount(parseInt(event.target.value))}
                    />
                </label>
                <label className="items-center flex">
                    Children:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        value={childCount}
                        onChange={(event) => setChildCount(parseInt(event.target.value))}
                    />
                </label>
            </div>
            <div className="flex items-center">
                <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date as Date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in Date"
                    customInput={<CustomInput />}
                    className="w-full min-w-0 bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"
                />
            </div>
            <div>
                <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date as Date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-out Date"
                    customInput={<CustomInput />}
                    className="w-full min-w-0 bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"
                />
            </div>
            <div className="flex gap-1">
                <button className="w-2/3 bg-blue-600 text-white p-2 font-bold rounded hover:bg-blue-500 transition-colors">
                    Search
                </button>
                <button className="w-2/3 bg-red-600 text-white p-2 font-bold rounded hover:bg-red-500 transition-colors" type="button" onClick={() => {
                    setDestination('');
                    setCheckIn(new Date());
                    setCheckOut(new Date());
                    setAdultCount(1);
                    setChildCount(0);
                }}>
                    Clear
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
