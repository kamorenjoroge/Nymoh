import { FiBell, FiSearch, FiUser } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-light shadow-md z-30 md:left-64 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* User profile and notifications */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-back relative">
            <FiBell className="text-dark" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-lama"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <FiUser className="text-dark" />
            </div>
            <span className="hidden md:inline text-dark">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;