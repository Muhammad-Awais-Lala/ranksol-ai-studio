import React, { useState } from 'react';

interface NavigationLink {
    text: string;
    href: string;
    target?: string;
}

interface SocialLink {
    href: string;
    icon: 'facebook' | 'instagram';
}

import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
    const { logout, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
    };

    const navigationLinks: NavigationLink[] = [
        { text: 'Home', href: '/' },
        { text: 'Construction', href: 'https://construction-planer.vercel.app/', target: '_blank' },
        { text: 'TAC LUX', href: 'https://kmigroups.com/product-category/tac-lux', target: '_blank' },
        { text: 'Super High Gloss UV', href: 'https://kmigroups.com/product-category/super-high-gloss-uv', target: '_blank' },
        { text: 'Contact us', href: 'https://kmigroups.com/contact', target: '_blank' }
    ];

    const socialLinks: SocialLink[] = [
        { href: 'https://www.facebook.com/kmigroup.com.pk', icon: 'facebook' },
        { href: 'https://www.instagram.com/kmigroup.official/', icon: 'instagram' }
    ];

    return (
        <div className="bg-[#EFE223] w-full z-50">
            <div className="max-w-[1440px] mx-auto h-[90px] relative">
                <nav className="flex justify-between items-center h-full px-4 w-full relative">
                    {/* Logo */}
                    <div className="logo z-50">
                        <a href="/" className="flex items-center gap-[7px] no-underline">
                            <img src="https://kmigroups.com/images/logo.webp" alt="logo" />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden lg:flex items-center gap-6">
                        {navigationLinks.map((link, index) => (
                            <li key={index}>
                                <a
                                    href={link.href}
                                    className="text-black text-[18px] font-semibold no-underline hover:opacity-70 transition-opacity"
                                    target={link.target || '_self'}
                                    rel={link.target ? 'noopener noreferrer' : ''}
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-2">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    {social.icon === 'facebook' ? (
                                        <svg width="31" height="31" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="16" cy="16" r="15" stroke="black" strokeWidth="1" fill="none"></circle>
                                            <path d="M17.2 10.2H18.8V7.3C18.5 7.3 17.6 7.2 16.5 7.2C14.2 7.2 12.6 8.7 12.6 11.3V13.7H10V16.9H12.6V23H15.9V16.9H18.5L19 13.7H15.9V11.6C15.9 10.7 16.3 10.2 17.2 10.2Z" fill="black"></path>
                                        </svg>
                                    ) : (
                                        <svg width="31" height="31" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="16" cy="16" r="15" stroke="black" strokeWidth="1" fill="none"></circle>
                                            <path d="M19.8 9H11.2C10 9 9 10 9 11.2V19.8C9 21 10 22 11.2 22H19.8C21 22 22 21 22 19.8V11.2C22 10 21 9 19.8 9ZM16.5 19.2C14.6 19.2 13.1 17.7 13.1 15.8C13.1 13.9 14.6 12.4 16.5 12.4C18.4 12.4 19.9 13.9 19.9 15.8C19.9 17.7 18.4 19.2 16.5 19.2ZM20 12.3C19.4 12.3 18.9 11.8 18.9 11.2C18.9 10.6 19.4 10.1 20 10.1C20.6 10.1 21.1 10.6 21.1 11.2C21.1 11.8 20.6 12.3 20 12.3Z" fill="black"></path>
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-md"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Hamburger (Mobile) */}
                    <div
                        id="hamburger"
                        className="lg:hidden flex flex-col cursor-pointer z-50"
                        onClick={toggleMenu}
                    >
                        <span className={`w-[25px] h-[3px] bg-black my-[3px] transition-all ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                        <span className={`w-[25px] h-[3px] bg-black my-[3px] transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-[25px] h-[3px] bg-black my-[3px] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    className={`${isMenuOpen ? 'flex' : 'hidden'} fixed inset-0 z-40 bg-[#EFE223] flex-col items-center justify-center gap-6 py-20 transition-all duration-300 overflow-y-auto`}
                >
                    <ul className="flex flex-col items-center gap-6 w-full px-4 mt-20">
                        {navigationLinks.map((link, index) => (
                            <li key={index} className="w-full">
                                <a
                                    href={link.href}
                                    className="block w-full py-2 text-center text-black text-[24px] font-bold"
                                    target={link.target || '_self'}
                                    rel={link.target ? 'noopener noreferrer' : ''}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xl mt-4 active:scale-95 transition-transform"
                        >
                            <LogOut size={24} />
                            Logout
                        </button>
                    )}

                    {/* Mobile Social Links */}
                    <div className="flex gap-6 mt-auto mb-10">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon === 'facebook' ? (
                                    <svg width="40" height="40" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="15.5" cy="15.5" r="15" stroke="black" strokeWidth="1" fill="white"></circle>
                                        <path d="M17.2 10.2H18.8V7.3C18.5 7.3 17.6 7.2 16.5 7.2C14.2 7.2 12.6 8.7 12.6 11.3V13.7H10V16.9H12.6V23H15.9V16.9H18.5L19 13.7H15.9V11.6C15.9 10.7 16.3 10.2 17.2 10.2Z" fill="black"></path>
                                    </svg>
                                ) : (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="11" stroke="black" strokeWidth="1" fill="white"></circle>
                                        <rect x="6.5" y="6.5" width="11" height="11" rx="3" stroke="black" strokeWidth="1.5" fill="none"></rect>
                                        <circle cx="12" cy="12" r="3" stroke="black" strokeWidth="1.5" fill="none"></circle>
                                        <circle cx="16" cy="8" r="1.2" fill="black"></circle>
                                    </svg>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
