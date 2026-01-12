import React from 'react';

interface LinkItem {
    text: string;
    href: string;
    target?: string;
}

interface SocialLink {
    href: string;
    icon: string;
    alt: string;
    target?: string;
}

const Footer: React.FC = () => {
    const quickLinks: LinkItem[] = [
        { text: 'Design Studio', href: 'https://room-customizer-tau.vercel.app/', target: '_blank' },
        { text: 'Construction Estimator', href: 'https://construction-planer.vercel.app/', target: '_blank' },
        { text: 'Catalog / Brochure', href: 'https://kmigroups.com/catalog', target: '_blank' },
        { text: 'All Products', href: 'https://kmigroups.com/products', target: '_blank' },
        { text: 'Product Categories', href: 'https://kmigroups.com/product-categories', target: '_blank' }
    ];

    const companyLinks: LinkItem[] = [
        { text: 'Vendors', href: 'https://kmigroups.com/vendors', target: '_blank' },
        { text: 'Our Portfolio', href: 'https://kmigroups.com/portfolios', target: '_blank' },
        { text: 'Privacy Policy', href: 'https://kmigroups.com/privacy-policy', target: '_blank' },
        { text: 'Become a Vendor', href: 'https://kmigroups.com/contact', target: '_blank' }
    ];

    const toolLinks: LinkItem[] = [
        { text: 'Construction Estimator', href: 'https://construction-planer.vercel.app/', target: '_blank' },
        { text: 'Design Studio', href: 'https://room-customizer-tau.vercel.app/', target: '_blank' }
    ];

    const socialLinks: SocialLink[] = [
        { href: 'https://www.facebook.com/kmigroup.com.pk', icon: 'fb.svg', alt: 'Facebook', target: '_blank' },
        { href: 'https://www.instagram.com/kmigroup.official/', icon: 'instagram-black.svg', alt: 'Instagram', target: '_blank' }
    ];

    return (
        <section className="relative bg-[#EFE223]">
            <footer className="py-10 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-4">
                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Left Section - Logo + Description */}
                        <div className="lg:col-span-4">
                            <a href="/">
                                <img src="https://kmigroups.com/images/kmi-iso.png" alt="KMI Group Logo" className="w-40 mb-6" />
                            </a>

                            <p className="text-black text-base mb-4">
                                KMI Group is one of Pakistan's leading manufacturers of MDF boards, UV sheets,
                                laminates, and decorative surfaces. For over a decade, we've been empowering
                                furniture makers, architects, and designers with durable and innovative material solutions.
                            </p>

                            <p className="text-black text-base">
                                Quality, technology, and design all under: <span className="text-black font-bold">KMI Group</span>.
                            </p>

                            <div className="mt-10 pt-10 text-center md:text-left hidden lg:block">
                                <p className="text-[12px] text-black">
                                    © 2025 KMI Group. All Rights Reserved - By{' '}
                                    <a
                                        href="https://ranksol.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black font-bold"
                                    >
                                        Ranksol
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Links & Social */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 gap-8 lg:gap-12 lg:ml-10">
                            {/* Quick Links */}
                            <div>
                                <h3 className="font-bold text-xl lg:text-2xl text-black mb-5">Quick Links</h3>
                                <ul className="space-y-4">
                                    {quickLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-black text-lg hover:text-black transition"
                                                target={link.target}
                                                rel="noopener noreferrer"
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-bold text-xl lg:text-2xl text-black mb-5">Company</h3>
                                <ul className="space-y-4">
                                    {companyLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-black text-lg hover:text-black transition"
                                                target={link.target}
                                                rel="noopener noreferrer"
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Social Media & Tools */}
                            <div className="col-span-2 md:col-span-1">
                                <h3 className="font-bold text-xl lg:text-2xl text-black mb-5">Social Media</h3>

                                {/* Social Icons */}
                                <div className="flex gap-4 mb-6">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-70 transition"
                                        >
                                            <img
                                                src={`https://kmigroups.com/images/${social.icon}`}
                                                alt={social.alt}
                                                className="w-10 h-10"
                                            />
                                        </a>
                                    ))}
                                </div>

                                <p className="text-black text-base mb-6 max-w-xs">
                                    Plan smarter. Visualize materials and estimate costs using the tools below:
                                </p>

                                {/* Tool Buttons */}
                                <div className="space-y-3">
                                    {toolLinks.map((tool, index) => (
                                        <a
                                            key={index}
                                            href={tool.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-black text-white rounded-md px-5 py-3.5 flex items-center justify-between text-sm lg:text-base border border-transparent hover:bg-transparent hover:border-black hover:text-black transition duration-300"
                                        >
                                            <span>{tool.text}</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright - Mobile */}
                    <div className="text-center md:text-left pt-6 lg:hidden">
                        <p className="text-[12px] text-black">
                            © ({new Date().getFullYear()}) KMI Group. All Rights Reserved - By{' '}
                            <a
                                href="https://ranksol.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black font-bold"
                            >
                                Ranksol
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Footer;
