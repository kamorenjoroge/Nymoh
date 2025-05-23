"use client";
import { FiHome, FiShoppingBag, FiUsers, FiSettings, FiPieChart, FiLogOut } from 'react-icons/fi';
import { FaShoePrints } from 'react-icons/fa';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import {  usePathname } from 'next/navigation';
import Link from 'next/link';

const SideBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/' },
    { name: 'Products', icon: <FaShoePrints />, path: '/products' },
    { name: 'Orders', icon: <FiShoppingBag />, path: '/orders' },
    { name: 'Customers', icon: <FiUsers />, path: '/customers' },
    { name: 'Analytics', icon: <FiPieChart />, path: '/analytics' },
    { name: 'Settings', icon: <FiSettings />, path: '/settings' },
   
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: router.push('/login');  
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-primary text-light transition-all duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-4 flex items-center justify-center border-b border-backold h-16">
          <h1 className="text-xl font-bold">Tess Treasure</h1>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.name} passHref>
              <div
                className={`flex items-center px-6 py-3 cursor-pointer transition-colors
                  ${pathname === item.path ? 'bg-backold text-dark' : 'hover:bg-back text-dark'}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-backold">
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-back text-dark"
            onClick={handleLogout}
          >
            <span className="mr-3"><FiLogOut /></span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;