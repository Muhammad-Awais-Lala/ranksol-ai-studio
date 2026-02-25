import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';

const Header: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 right-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-8 flex items-center justify-between">
            {/* Left: Project Context */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                        Active Workspace
                    </span>
                    <h1 className="text-lg font-black text-black leading-none flex items-center gap-2">
                        Studio AI <span className="text-[#F37021]">1.0</span>
                    </h1>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="hover:text-black cursor-pointer transition-colors">Projects</span>
                    <span>/</span>
                    <span className="text-black font-bold">New Design</span>
                </nav>
            </div>

            {/* Center: Search (Visual only for now) */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-12">
                <div className="relative w-full group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F37021] transition-colors">
                        <HiOutlineSearch size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search designs or assets..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#F37021]/10 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2.5 text-gray-500 hover:text-[#F37021] hover:bg-orange-50 rounded-xl transition-all relative">
                    <HiOutlineBell size={24} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-100 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    {/* <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-black leading-none">RankSol Admin</p>
                        <p className="text-[11px] font-medium text-gray-500">Premium Plan</p>
                    </div> */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center p-2.5 bg-black text-white rounded-xl hover:bg-[#F37021] transition-all duration-300 shadow-lg shadow-black/10 group"
                        title="Logout"
                    >
                        Logout
                        <HiOutlineLogout size={22} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;