import isoLogo from '../assets/iso-logo-black.webp';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <section className="relative bg-black border-t border-gray-800">
            <footer className="pt-12 pb-8 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-4">
                    {/* Main Grid */}
                    <div className="self-start grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Left Section - Logo + Description */}
                        <div className="self-start lg:col-span-4">
                            <a className="inline-block" href="https://ranksol.com">
                                <img
                                    src="https://ranksol.com/wp-content/uploads/2023/10/ranksol-logo.png"
                                    alt="RankSol Logo"
                                    className="h-12 w-auto mb-6"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://ranksoltools.com/assets/img/logo.png";
                                    }}
                                />
                            </a>

                            <p className="text-gray-400 text-base mb-6 leading-relaxed">
                                RankSol is a leading digital agency providing exceptional Web, App, and Software development services.
                                Our AI Design Studio empowers businesses with innovative AI-driven creative solutions and high-quality
                                digital transformations.
                            </p>
                            <div className="hidden lg:block">
                                <p className="text-[13px] text-gray-500">
                                    © {currentYear} <span className="text-[#F37021] font-semibold">RankSol</span>. All Rights Reserved.
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Links & Social */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 gap-8 lg:gap-12 lg:ml-10">
                            {/* Quick Links */}
                            <div>
                                <p className="font-bold text-xl text-white mb-6">Explore</p>
                                <ul className="space-y-4">
                                    <li><a href="https://ranksoltools.com"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Free SEO Tools</a></li>
                                    <li><a href="https://ranksol.com/portfolio"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Our Portfolio</a></li>
                                    <li><a href="https://ranksol.com/services"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">All Services</a></li>
                                    <li><a href="https://ranksol.com/contact-us"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Get in Touch</a></li>
                                </ul>
                            </div>
                            {/* Company */}
                            <div>
                                <p className="font-bold text-xl text-white mb-6">Company</p>
                                <ul className="space-y-4">
                                    <li><a href="https://ranksol.com/about-us"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">About Us</a></li>
                                    <li><a href="https://ranksol.com/careers"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Careers</a></li>
                                    <li><a href="https://ranksol.com/blog"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Our Blog</a></li>
                                    <li><a href="https://ranksol.com/privacy-policy"
                                        className="text-gray-400 text-base hover:text-[#F37021] transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>

                            {/* Social Media */}
                            <div className="col-span-2 md:col-span-1">
                                <p className="font-bold text-xl text-white mb-6">Stay Connected</p>
                                <div className="flex gap-4">
                                    {/* facebook */}
                                    <a href="https://www.facebook.com/ranksol" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#F37021] transition-all transform hover:-translate-y-1">
                                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                    </a>
                                    {/* instagram */}
                                    <a href="https://www.instagram.com/ranksol" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#F37021] transition-all transform hover:-translate-y-1">
                                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </a>
                                    {/* twitter */}
                                    <a href="https://twitter.com/ranksol" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#F37021] transition-all transform hover:-translate-y-1">
                                        <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-900 text-center lg:hidden">
                        <p className="text-[13px] text-gray-500">
                            © {currentYear} <span className="text-[#F37021] font-semibold">RankSol</span>. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Footer;