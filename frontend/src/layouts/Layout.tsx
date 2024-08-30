import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar';
import ScrollToTopButton from '../components/ScrollToTopButton';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className='flex flex-col min-h-screen w-full overflow-x-hidden dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black'>
            <Header />
            <Hero />
            <div className='container mx-auto'>
                <SearchBar />
            </div>
            <div className='container mx-auto py-5 flex-1'>{children}</div>
            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export default Layout