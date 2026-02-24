import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineCube,
    HiOutlineCollection,
    HiOutlineCog,
    HiOutlineQuestionMarkCircle
} from 'react-icons/hi';

const Sidebar: React.FC = () => {
    const navItems = [
        { icon: HiOutlineHome, label: 'Dashboard', path: '/' },
        { icon: HiOutlineCube, label: 'Studio', path: '/studio' },
        { icon: HiOutlineCollection, label: 'My Designs', path: '/designs' },
        { icon: HiOutlineQuestionMarkCircle, label: 'Help', path: '/help' },
        { icon: HiOutlineCog, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-black border-r border-gray-800 flex flex-col items-center py-8 z-[60]">
            {/* Logo placeholder icon */}
            <div className="mb-10 text-[#F37021]">
                <HiOutlineCube size={40} />
            </div>

            <nav className="flex flex-col gap-6 flex-1">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            p-3 rounded-xl transition-all duration-300 group relative
                            ${isActive
                                ? 'bg-[#F37021] text-white shadow-[0_0_15px_rgba(243,112,33,0.4)]'
                                : 'text-gray-500 hover:text-white hover:bg-gray-900'}
                        `}
                    >
                        <item.icon size={26} />

                        {/* Tooltip */}
                        <span className="absolute left-20 ml-2 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-800">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F37021] to-[#ff8a3d] flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    RS
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
