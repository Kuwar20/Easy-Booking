import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt } from 'react-icons/fa';
import React from "react";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount
        );
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
            className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
        >
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={25} className="mr-2" />
                <input
                    placeholder="Where are you going?"
                    className="text-md w-full focus:outline-none"
                    value={destination}
                    onChange={(event) => {setDestination(event.target.value)
                    }}
                />
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
                <button className="w-2/3 bg-red-600 text-white p-2 font-bold rounded hover:bg-red-500 transition-colors">
                    Clear
                </button>
            </div>
        </form>
    );
};

export default SearchBar;

// import React, { FormEvent, useState, useRef } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useNavigate } from "react-router-dom";
// import { MdTravelExplore } from "react-icons/md";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { searchHotelSuggestions } from "../api-client";
// import { HotelType } from "../../../backend/src/shared/types";

// const SearchBar = () => {
//     const navigate = useNavigate();

//     // State management
//     const [destination, setDestination] = useState<string>("");
//     const [checkIn, setCheckIn] = useState<Date>(new Date());
//     const [checkOut, setCheckOut] = useState<Date>(new Date());
//     const [adultCount, setAdultCount] = useState<number>(1);
//     const [childCount, setChildCount] = useState<number>(0);
//     const [suggestions, setSuggestions] = useState<string[]>([]);
//     const inputRef = useRef<HTMLInputElement>(null);

//     const handleSearchInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         setDestination(value);

//         if (value.length >= 2) {
//             try {
//                 // Simulate API call delay
//                 await new Promise((resolve) => setTimeout(resolve, 500));

//                 // Call the searchHotelSuggestions function
//                 const suggestionsData = await searchHotelSuggestions(value);

//                 // Find the closest suggestion based on your matching criteria
//                 const closestSuggestion = findClosestSuggestion(value, suggestionsData);

//                 // Update input field with closest suggestion
//                 if (closestSuggestion) {
//                     setDestination(closestSuggestion.name);
//                 }

//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//                 setDestination(value); // Reset input to original value on error
//             }
//         }
//     };

//     // Function to find closest suggestion based on matching criteria
//     const findClosestSuggestion = (value: string, suggestions: HotelType[]): HotelType | undefined => {
//         // Implement your matching logic here
//         // For example, find the suggestion with the shortest Levenshtein distance
//         if (suggestions.length > 0) {
//             let closestMatch = suggestions[0];
//             let minDistance = levenshteinDistance(value, closestMatch.name.toLowerCase());

//             for (let i = 1; i < suggestions.length; i++) {
//                 const distance = levenshteinDistance(value, suggestions[i].name.toLowerCase());
//                 if (distance < minDistance) {
//                     minDistance = distance;
//                     closestMatch = suggestions[i];
//                 }
//             }

//             return closestMatch;
//         }

//         return undefined;
//     };

//     // Function to calculate Levenshtein distance
//     const levenshteinDistance = (s1: string, s2: string): number => {
//         const m = s1.length;
//         const n = s2.length;
//         const dp: number[][] = [];

//         for (let i = 0; i <= m; i++) {
//             dp[i] = [];
//             dp[i][0] = i;
//         }

//         for (let j = 0; j <= n; j++) {
//             dp[0][j] = j;
//         }

//         for (let i = 1; i <= m; i++) {
//             for (let j = 1; j <= n; j++) {
//                 if (s1[i - 1] === s2[j - 1]) {
//                     dp[i][j] = dp[i - 1][j - 1];
//                 } else {
//                     dp[i][j] = Math.min(
//                         dp[i - 1][j] + 1, // Deletion
//                         dp[i][j - 1] + 1, // Insertion
//                         dp[i - 1][j - 1] + 1 // Substitution
//                     );
//                 }
//             }
//         }

//         return dp[m][n];
//     };
//     // Function to handle suggestion click
//     const handleSuggestionClick = (suggestion: string) => {
//         setDestination(suggestion);
//         setSuggestions([]);
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     };

//     // Function to handle form submission
//     const handleSubmit = (event: FormEvent) => {
//         event.preventDefault();
//         navigate("/search");
//         // Add logic to save search values if needed
//     };

//     // Custom input component for DatePicker
//     const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
//         <button
//             className="w-full min-w-0 bg-white p-2 focus:outline-none flex items-center"
//             onClick={onClick}
//             ref={ref}
//         >
//             <FaRegCalendarAlt className="mr-2" style={{ fontSize: "20px", marginRight: "10px" }} />
//             {value}
//         </button>
//     ));

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
//         >
//             <div className="flex flex-row items-center flex-1 bg-white p-2 relative">
//                 <MdTravelExplore size={25} className="mr-2" />
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Where are you going?"
//                     className="text-md w-full focus:outline-none"
//                     value={destination}
//                     onChange={handleSearchInputChange}
//                 />
//                 {suggestions.length > 0 && (
//                     <ul className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg">
//                         {suggestions.map((suggestion, index) => (
//                             <li
//                                 key={index}
//                                 className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                                 onClick={() => handleSuggestionClick(suggestion)}
//                             >
//                                 {suggestion}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             <div className="flex bg-white px-2 py-1 gap-2">
//                 <label className="items-center flex">
//                     Adults:
//                     <input
//                         className="w-full p-1 focus:outline-none font-bold"
//                         type="number"
//                         min={1}
//                         max={20}
//                         value={adultCount}
//                         onChange={(event) => setAdultCount(parseInt(event.target.value))}
//                     />
//                 </label>
//                 <label className="items-center flex">
//                     Children:
//                     <input
//                         className="w-full p-1 focus:outline-none font-bold"
//                         type="number"
//                         min={0}
//                         max={20}
//                         value={childCount}
//                         onChange={(event) => setChildCount(parseInt(event.target.value))}
//                     />
//                 </label>
//             </div>

//             <div className="flex items-center">
//                 <DatePicker
//                     selected={checkIn}
//                     onChange={(date) => setCheckIn(date as Date)}
//                     selectsStart
//                     startDate={checkIn}
//                     endDate={checkOut}
//                     minDate={new Date()}
//                     placeholderText="Check-in Date"
//                     customInput={<CustomInput />}
//                     className="w-full min-w-0 bg-white p-2 focus:outline-none"
//                     wrapperClassName="min-w-full"
//                 />
//             </div>

//             <div>
//                 <DatePicker
//                     selected={checkOut}
//                     onChange={(date) => setCheckOut(date as Date)}
//                     selectsStart
//                     startDate={checkIn}
//                     endDate={checkOut}
//                     minDate={new Date()}
//                     placeholderText="Check-out Date"
//                     customInput={<CustomInput />}
//                     className="w-full min-w-0 bg-white p-2 focus:outline-none"
//                     wrapperClassName="min-w-full"
//                 />
//             </div>

//             <div className="flex gap-1">
//                 <button className="w-2/3 bg-blue-600 text-white p-2 font-bold rounded hover:bg-blue-500 transition-colors">
//                     Search
//                 </button>
//                 <button className="w-2/3 bg-red-600 text-white p-2 font-bold rounded hover:bg-red-500 transition-colors">
//                     Clear
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default SearchBar;
