import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';
import { FaHotel, FaBookmark, FaUser } from 'react-icons/fa';

const Header = () => {
    const { isLoggedIn } = useAppContext();

    return (
        <header className='bg-blue-700 py-4 shadow-lg'>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className='text-2xl text-white font-bold tracking-tight'>
                            Easy Booking
                        </span>
                    </Link>
                    <nav className='flex items-center space-x-4'>
                        {isLoggedIn ? (
                            <>
                                <Link 
                                    className='text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center' 
                                    to="/my-bookings"
                                >
                                    <FaBookmark className="mr-2" />
                                    My Bookings
                                </Link>
                                <Link 
                                    className='text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center' 
                                    to="/my-hotels"
                                >
                                    <FaHotel className="mr-2" />
                                    My Hotels
                                </Link>
                                <SignOutButton />
                            </>
                        ) : (
                            <Link 
                                to="/sign-in"
                                className='bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 hover:text-blue-700 transition duration-300 flex items-center shadow-md'
                            >
                                Sign In
                                <FaUser className="ml-2" />
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;