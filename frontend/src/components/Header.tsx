import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';

const Header = () => {
    const { isLoggedIn } = useAppContext();

    return (
        <div className='bg-blue-700 py-4 md:py-6'>
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                <span className='text-xl md:text-3xl text-white font-bold tracking-tight md:ml-4 flex items-center mb-2 md:mb-0'>
                    <Link to="/" className="md:relative">
                        <span className="md:absolute -top-2 text-white">Booking</span>
                    </Link>
                </span>
                <span className='flex flex-col md:flex-row items-center space-x-2'>
                    {isLoggedIn ? <>
                        <Link className='flex items-center text-white px-3 font-bold hover:bg-gray-400' to="/my-bookings">My Bookings</Link>
                        <Link className='flex items-center text-white px-3 font-bold  hover:bg-gray-400' to="/my-hotels">My Hotels</Link>
                        <SignOutButton />
                    </> : <Link to="/sign-in"
                        className='flex items-center bg-white text-blue-600 px-3 h-8 md:h-12 rounded-full font-bold hover:bg-gray-400'>
                        Sign In
                    </Link>}
                </span>
            </div>
        </div>
    );
}

export default Header;