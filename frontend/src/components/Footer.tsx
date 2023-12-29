// const Footer = () => {
//     return (
//         <div classNameName="bg-blue-800 py-6 md:py-10">
//             <div classNameName="container mx-auto flex flex-col md:flex-row justify-between items-center">
//                 <span classNameName="text-xl md:text-3xl text-white font-bold tracking-tight mb-2 md:mb-0">
//                     Holidays.com
//                 </span>
//                 <span classNameName="text-white font-bold tracking-tight flex flex-col md:flex-row gap-4">
//                     <p classNameName="cursor-pointer">Privacy Policy</p>
//                     <p classNameName="cursor-pointer">Terms of Service</p>
//                 </span>
//             </div>
//         </div>
//     );
// }

// export default Footer;



const Footer = () => {
    return (
        <div>

            <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Booking.com</span>
                        </a>
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">About</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" className="hover:underline">Booking.com</a>. All Rights Reserved.</span>
                </div>
            </footer>
        </div>
    )
}

export default Footer