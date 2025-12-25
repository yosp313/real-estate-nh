import { Head, Link, usePage } from '@inertiajs/react';

interface Project {
    id: number;
    slug: string;
    name: string;
    price_starts_at: string;
    image_url: string;
}

interface Props {
    projects: Project[];
}

interface SharedProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
    [key: string]: any;
}

export default function Index({ projects }: Props) {
    const { locale, translations: t, availableLocales, localeNames } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    return (
        <>
            <Head title={t.page_title} />
            
            <div className={`min-h-screen bg-[#f8f8f8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Language Switcher */}
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-white border border-gray-200 shadow-sm">
                        {availableLocales.map((loc) => (
                            <Link
                                key={loc}
                                href={`/locale/${loc}`}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                    locale === loc
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Hero Section */}
                <section className="relative bg-white">
                    <div className="mx-auto max-w-4xl px-6 py-20">
                        {/* Logo/Brand */}
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-7xl font-light tracking-wider text-gray-900 mb-4">
                                {t.brand_name}
                            </h1>
                            <p className="text-sm tracking-[0.3em] text-gray-500 uppercase">
                                {t.brand_tagline}
                            </p>
                        </div>

                        {/* Hero Image */}
                        <div className="relative aspect-[16/9] overflow-hidden mb-8">
                            <img
                                src={projects[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'}
                                alt="Featured Property"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <p className="text-white text-sm tracking-wider mb-2">{t.featured_property.toUpperCase()}</p>
                                <h2 className="text-white text-2xl font-light">{t.exclusive_estate}</h2>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-3xl px-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-light text-gray-900 mb-6">{t.about_nh}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t.about_description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="bg-[#f8f8f8] py-20">
                    <div className="mx-auto max-w-4xl px-6">
                        <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">{t.our_services}</h2>
                        <div className="space-y-4">
                            {[
                                { title: t.property_sales, desc: t.property_sales_desc },
                                { title: t.property_management, desc: t.property_management_desc },
                                { title: t.investment_consulting, desc: t.investment_consulting_desc },
                                { title: t.market_analysis, desc: t.market_analysis_desc },
                            ].map((service, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors duration-300">
                                    <h3 className="text-xl font-light text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Properties Grid */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">{t.our_properties}</h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden mb-4">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-light text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-900">
                                            {t.from} ${project.price_starts_at.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-[#f8f8f8] py-20">
                    <div className="mx-auto max-w-2xl px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-light text-gray-900 mb-4">{t.get_in_touch}</h2>
                            <p className="text-gray-600">
                                {t.get_in_touch_desc}
                            </p>
                        </div>
                        <form className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder={t.your_name}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder={t.your_email}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={4}
                                    placeholder={t.your_message}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 hover:bg-gray-800 transition-colors font-light tracking-wider"
                            >
                                {t.send_message.toUpperCase()}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-12">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            {/* Brand */}
                            <div>
                                <div className="text-2xl font-light tracking-wider text-gray-900 mb-4">{t.brand_name}</div>
                                <p className="text-gray-600 text-sm">
                                    {t.brand_tagline}
                                </p>
                            </div>
                            
                            {/* Quick Links */}
                            <div>
                                <h3 className="font-light text-gray-900 mb-4 tracking-wider">{t.navigation.toUpperCase()}</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <a href="#" className="block hover:text-gray-900 transition-colors">{t.about}</a>
                                    <a href="#" className="block hover:text-gray-900 transition-colors">{t.properties}</a>
                                    <a href="#" className="block hover:text-gray-900 transition-colors">{t.services}</a>
                                    <a href="#" className="block hover:text-gray-900 transition-colors">{t.contact}</a>
                                </div>
                            </div>
                            
                            {/* Contact */}
                            <div>
                                <h3 className="font-light text-gray-900 mb-4 tracking-wider">{t.contact_info.toUpperCase()}</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>info@nh-realestate.com</p>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-8 border-t border-gray-200 text-center text-xs text-gray-500 tracking-wider">
                            <p>{t.copyright.replace(':year', new Date().getFullYear().toString()).toUpperCase()}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
