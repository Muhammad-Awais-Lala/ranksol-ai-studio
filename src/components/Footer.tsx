import isoLogo from '../assets/iso-logo-black.webp';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <section className="relative bg-[#EFE223]">
            <footer className="pt-7 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-4">
                    {/* Main Grid */}
                    <div className="self-start grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Left Section - Logo + Description */}
                        <div className="self-start lg:col-span-4">
                            <a className="inline-block" href="https://kmigroups.com">
                                <img src="https://kmigroups.com/images/logo.webp" alt="KMI Group Logo" className="w-40 mb-2" />
                            </a>

                            <p className="text-black text-base mb-4">
                                KMI Group is Pakistan’s leading manufacturer of MDF boards, UV sheets, laminates, and decorative
                                surfaces. For over a decade, MDF has been empowering furniture makers, architects, and interior
                                designers with durable and innovative material.
                            </p>
                            <div className="mt-5 pt-5 text-center lg:pb-2 md:text-left hidden lg:block">
                                <p className="text-[12px] text-black">
                                    © {currentYear} KMI Group. All Rights Reserved - By <a href="https://ranksol.com"
                                        className="text-black font-bold">Ranksol</a>
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Links & Social */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 gap-8 lg:gap-12 lg:ml-10">
                            {/* Quick Links */}
                            <div>
                                <p className="font-bold text-xl lg:text-2xl text-black mb-5">Quick Links</p>
                                <ul className="space-y-4">
                                    <li><a href="https://kmigroups.com/catalog"
                                        className="text-black text-lg hover:text-black transition">Catalogue / Brochure</a></li>
                                    <li><a href="https://kmigroups.com/products"
                                        className="text-black text-lg hover:text-black transition">All Products</a></li>
                                    <li><a href="https://kmigroups.com/contact"
                                        className="text-black text-lg hover:text-black transition">Become a Vendor</a></li>
                                    <li><a href="https://kmigroups.com/blogs"
                                        className="text-black text-lg hover:text-black transition">Blogs</a></li>
                                </ul>
                            </div>
                            {/* Company */}
                            <div>
                                <p className="font-bold text-xl lg:text-2xl text-black mb-5">Company</p>
                                <ul className="space-y-4">
                                    <li><a href="https://kmigroups.com/careers"
                                        className="text-black text-lg hover:text-black transition">Careers</a></li>
                                    <li><a href="https://kmigroups.com/vendors"
                                        className="text-black text-lg hover:text-black transition">Vendors</a></li>
                                    <li><a href="https://kmigroups.com/privacy-policy"
                                        className="text-black text-lg hover:text-black transition">Privacy Policy</a></li>
                                </ul>
                            </div>

                            {/* Social Media & Tools */}
                            <div className="col-span-2 md:col-span-1">
                                <p className="font-bold text-xl lg:text-2xl text-black mb-5">Social Media</p>

                                {/* Social Icons */}
                                <div className="flex gap-4 mb-6 lg:gap-1 xl:gap-4">
                                    {/* facebook */}
                                    <a href="https://www.facebook.com/kmigroup.com.pk" target="_blank" rel="noopener noreferrer" alt="facebook"
                                        className="hover:opacity-70 transition">
                                        <svg width="42" height="42" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 32 32" fill="none">
                                            <circle cx="16" cy="16" r="15" stroke="black" strokeWidth="0.75" />
                                            <path
                                                d="M17 10.4h1.9V8.1c-.3 0-1.1-.1-2.1-.1-2.2 0-3.7 1.3-3.7 3.7v2.1H10.9v2.6h2.2V24h2.7v-7.6h2.2l.3-2.6h-2.5v-1.8c0-.8.3-1.6 1.2-1.6Z"
                                                fill="black" />
                                        </svg>
                                    </a>
                                    {/* instagram */}
                                    <a href="https://www.instagram.com/kmigroup.official/" target="_blank" rel="noopener noreferrer" alt="instagram"
                                        className="hover:opacity-70 transition">
                                        <svg width="43" height="43" viewBox="0 0 31 31" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M30.5947 15.4861C30.5947 7.14197 23.8305 0.377708 15.4863 0.377708C7.14219 0.377708 0.37793 7.14197 0.37793 15.4861C0.37793 23.8302 7.14219 30.5945 15.4863 30.5945C23.8305 30.5945 30.5947 23.8302 30.5947 15.4861Z"
                                                stroke="black" strokeWidth="0.75542" strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <g transform="translate(10.5 10.5) scale(1)">
                                                <path
                                                    d="M4.90885 2.3928C3.51557 2.3928 2.39213 3.51655 2.39213 4.91023C2.39213 6.30391 3.51557 7.42766 4.90885 7.42766C6.30214 7.42766 7.42558 6.30391 7.42558 4.91023C7.42558 3.51655 6.30214 2.3928 4.90885 2.3928ZM4.90885 6.54904C4.00845 6.54904 3.27326 5.81364 3.27326 4.91298C3.27326 4.01233 4.00845 3.27693 4.90885 3.27693C5.80926 3.27693 6.54445 4.01233 6.54445 4.91298C6.54445 5.81364 5.80926 6.54904 4.90885 6.54904ZM8.11671 2.29089C8.11671 2.61865 7.85513 2.87756 7.53021 2.87756C7.2053 2.87756 6.94371 2.6159 6.94371 2.29089C6.94371 1.96588 7.2053 1.70422 7.53021 1.70422C7.85513 1.70422 8.11671 1.96588 8.11671 2.29089ZM9.78535 2.88582C9.7468 2.09809 9.56782 1.40125 8.99233 0.828356C8.4196 0.255462 7.72021 0.0736776 6.93545 0.0351173C6.12591 -0.0117058 3.69455 -0.0117058 2.88501 0.0351173C2.10025 0.0736776 1.40361 0.252707 0.828124 0.825601C0.252637 1.3985 0.0736569 2.09809 0.0351075 2.88306C-0.0117025 3.69283 -0.0117025 6.12488 0.0351075 6.93464C0.0736569 7.72237 0.252637 8.41921 0.828124 8.9921C1.40361 9.565 2.10025 9.74678 2.88501 9.78534C3.69455 9.83217 6.12591 9.83217 6.93545 9.78534C7.72296 9.74678 8.4196 9.56775 8.99233 8.9921C9.56507 8.41921 9.7468 7.71962 9.78535 6.93464C9.83216 6.12488 9.83216 3.69558 9.78535 2.88306V2.88582ZM8.73901 7.80775C8.56829 8.23743 8.23787 8.56794 7.80556 8.74146C7.15849 8.99761 5.62477 8.93977 4.91161 8.93977C4.19844 8.93977 2.66197 8.99761 2.01765 8.74146C1.5881 8.5707 1.25767 8.24018 1.0842 7.80775C0.828124 7.16049 0.885948 5.62635 0.885948 4.91298C0.885948 4.19962 0.828124 2.66272 1.0842 2.01821C1.25492 1.58854 1.58534 1.25803 2.01765 1.08451C2.66473 0.828356 4.19844 0.886196 4.91161 0.886196C5.62477 0.886196 7.16124 0.828356 7.80556 1.08451C8.23512 1.25527 8.56554 1.58579 8.73901 2.01821C8.99509 2.66548 8.93726 4.19962 8.93726 4.91298C8.93726 5.62635 8.99509 7.16325 8.73901 7.80775Z"
                                                    fill="black" />
                                            </g>
                                        </svg>
                                    </a>

                                    {/* twitter */}
                                    <a href="https://x.com/thekmigroup" target="_blank" rel="noopener noreferrer" alt="Twitter"
                                        className="hover:opacity-70 transition">
                                        <svg width="42" height="42" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="9.375" fill="none" stroke="black"
                                                strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                vectorEffect="non-scaling-stroke" />
                                            <g transform="translate(5,5) scale(0.5)">
                                                <path d="M6.67102 5.36279L13.2324 13.7454H14.2334L7.74486 5.36279H6.67102Z"
                                                    fill="black" />
                                                <path
                                                    d="M12.7314 14.7979L9.87386 11.1507L6.59774 14.7979H4.78677L9.01843 10.0713L4.55017 4.35233H8.2904L10.8749 7.69492L13.8689 4.35233H15.6799L11.7212 8.783L16.3806 14.7979H12.7314Z"
                                                    fill="black" />
                                            </g>
                                        </svg>
                                    </a>
                                    {/* pinterest */}
                                    <a href="https://www.pinterest.com/kmigroup/" target="_blank" rel="noopener noreferrer" alt="Pinterest"
                                        className="hover:opacity-70 transition">
                                        <svg width="42" height="42" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="9.375" fill="none" stroke="black"
                                                strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                vectorEffect="non-scaling-stroke" />
                                            <g transform="translate(5,5) scale(0.50)">
                                                <path d="M6.08572 18.4946C6.00194 17.737 5.92634 16.5718 6.11897 15.7448
                                                C6.29289 14.9975 7.24173 10.9854 7.24173 10.9854
                                                C7.24173 10.9854 6.95526 10.4118 6.95526 9.56373
                                                C6.95526 8.23235 7.72695 7.23836 8.68786 7.23836
                                                C9.50471 7.23836 9.89938 7.85169 9.89938 8.58715
                                                C9.89938 9.40878 9.37632 10.6369 9.1063 11.7751
                                                C8.88076 12.7283 9.58427 13.5055 10.5243 13.5055
                                                C12.2262 13.5055 13.5344 11.7111 13.5344 9.12075
                                                C13.5344 6.82824 11.8869 5.2253 9.53474 5.2253
                                                C6.81028 5.2253 5.21109 7.26877 5.21109 9.38058
                                                C5.21109 10.2036 5.52808 11.086 5.92369 11.5657
                                                C6.00186 11.6605 6.01338 11.7436 5.99011 11.8403
                                                C5.91737 12.1428 5.7559 12.7932 5.72414 12.9263
                                                C5.68236 13.1015 5.58534 13.1387 5.40393 13.0543
                                                C4.20802 12.4975 3.46036 10.7493 3.46036 9.34489
                                                C3.46036 6.32443 5.65487 3.55062 9.787 3.55062
                                                C13.1086 3.55062 15.69 5.91744 15.69 9.08062
                                                C15.69 12.3806 13.6093 15.0363 10.7213 15.0363
                                                C9.75105 15.0363 8.83889 14.5323 8.52674 13.9369
                                                C8.52674 13.9369 8.0465 15.7651 7.93012 16.2131
                                                C7.71386 17.0449 7.13038 18.0874 6.74005 18.7233Z" fill="black" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                                {/* ISO LOGO */}
                                <a className="mt-5 inline-block" href="https://kmigroups.com">
                                    <img src={isoLogo} alt="ISO Logo" className="w-40 mb-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Copyright Mobile */}
                <div className="mx-auto px-4 md:px-6 lg:hidden mt-8">
                    <p className="text-[12px] text-black text-left mb-6">
                        © {currentYear} <span className="font-semibold">KMI Group</span>. All Rights Reserved - By
                        <a href="https://ranksol.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline ml-1">
                            Ranksol
                        </a>
                    </p>
                </div>
            </footer>
        </section>
    );
};

export default Footer;