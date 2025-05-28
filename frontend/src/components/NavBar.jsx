import React, { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

function NavBar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <nav className="bg-gray-800 text-white py-4 w-full top-0">
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo / Brand */}
                <div className="flex items-center">
                    <span className="font-bold text-xl">Customers</span>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    <a href="/" className="hover:text-gray-300">Customers</a>
                    <a href="/create" className="hover:text-gray-300">Create</a>
                    <a href="/upload" className="hover:text-gray-300">Upload</a>
                </div>
            </div>

            {/* Mobile Menu (Collapsed) */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="/" className="block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Home</a>
                    <a href="/about" className="block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">About</a>
                    <a href="/services" className="block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Services</a>
                    <a href="/contact" className="block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Contact</a>
                </div>
            </div>
        </nav>
    )
}

export default NavBar