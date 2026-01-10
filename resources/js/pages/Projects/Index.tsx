import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, FormEventHandler } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
    id: number;
    slug: string;
    name: string;
    type: string;
    area_sqm: number | null;
    location: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    is_featured: boolean;
    price_starts_at: string;
    image_url: string;
    description?: string;
}

interface Filters {
    type: string | null;
    min_area: string | null;
    project: string | null;
}

interface Props {
    projects: Project[];
    allProjects: { id: number; slug: string; name: string }[];
    propertyTypes: string[];
    existingTypes: string[];
    filters: Filters;
}

interface SharedProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
    flash?: { success?: boolean };
    [key: string]: unknown;
}

export default function Index({ projects, allProjects, propertyTypes, filters }: Props) {
    const { locale, translations: t, availableLocales, localeNames, flash } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    
    // Search filters
    const [selectedProject, setSelectedProject] = useState(filters.project || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [areaRange, setAreaRange] = useState(parseInt(filters.min_area || '50'));
    
    // Contact form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSearch = () => {
        router.get('/', {
            project: selectedProject || undefined,
            type: selectedType || undefined,
            min_area: areaRange > 50 ? areaRange : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleContactSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
                toast.success(t.contact_success, {
                    duration: 5000,
                    position: 'top-center',
                    icon: '✉️',
                });
            },
            preserveScroll: true,
        });
    };

    // Get featured projects
    const featuredProjects = projects.filter(p => p.is_featured);

    return (
        <>
            <Head title={t.page_title} />
            <Toaster 
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        color: '#ffffff',
                        border: '1px solid #c9a050',
                    },
                    success: {
                        iconTheme: { primary: '#c9a050', secondary: '#1a1a1a' },
                    },
                    error: {
                        iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
                    },
                }}
            />
            
            <div className={`min-h-screen bg-[#0d0d0d] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#c9a050]/20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="text-[#c9a050] font-bold text-xl">
                                    {t.brand_name}
                                </div>
                            </Link>
                            
                            <div className="hidden md:flex items-center gap-8">
                                <Link href="/" className="text-white hover:text-[#c9a050] transition-colors text-sm font-medium">
                                    {t.home}
                                </Link>
                                <Link href="#projects" className="text-gray-300 hover:text-[#c9a050] transition-colors text-sm font-medium">
                                    {t.properties}
                                </Link>
                                <Link href="#about" className="text-gray-300 hover:text-[#c9a050] transition-colors text-sm font-medium">
                                    {t.about}
                                </Link>
                                <Link href="#contact" className="text-gray-300 hover:text-[#c9a050] transition-colors text-sm font-medium">
                                    {t.contact}
                                </Link>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-[#c9a050]/30 rounded overflow-hidden">
                                    {availableLocales.map((loc) => (
                                        <Link
                                            key={loc}
                                            href={`/locale/${loc}`}
                                            className={`px-3 py-1.5 text-xs transition-colors ${
                                                locale === loc
                                                    ? 'bg-[#c9a050] text-[#1a1a1a] font-semibold'
                                                    : 'text-gray-300 hover:text-white'
                                            }`}
                                        >
                                            {localeNames[loc]}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center pt-16">
                    <div className="absolute inset-0">
                        <img
                            src={featuredProjects[0]?.image_url || projects[0]?.image_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {t.hero_title}
                        </h1>
                        <p className="text-xl md:text-2xl text-[#c9a050] font-medium mb-12">
                            {t.hero_subtitle}
                        </p>
                    </div>

                    {/* Search Filter Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-md border-t border-[#c9a050]/20">
                        <div className="mx-auto max-w-6xl px-4 py-6">
                            <div className="flex items-center justify-end gap-2 mb-4">
                                <span className="text-[#c9a050] text-sm font-medium">{t.search_your_unit}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">{t.project}</label>
                                    <select 
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        className="w-full bg-[#2d2d2d] border border-[#3d3d3d] text-white px-4 py-3 rounded focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="">{t.all}</option>
                                        {allProjects.map((project) => (
                                            <option key={project.id} value={project.slug}>{project.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">{t.type}</label>
                                    <select 
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full bg-[#2d2d2d] border border-[#3d3d3d] text-white px-4 py-3 rounded focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="">{t.all}</option>
                                        {propertyTypes.map((type) => (
                                            <option key={type} value={type}>{t[type] || type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">
                                        {t.area} - <span className="text-[#c9a050]">{areaRange}+ {t.sqm}</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="50" 
                                        max="500" 
                                        value={areaRange}
                                        onChange={(e) => setAreaRange(parseInt(e.target.value))}
                                        className="w-full h-2 bg-[#3d3d3d] rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                
                                <div>
                                    <button 
                                        onClick={handleSearch}
                                        className="w-full bg-[#c9a050] hover:bg-[#d4a84a] text-[#1a1a1a] font-semibold py-3 px-6 rounded transition-all"
                                    >
                                        {t.search}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" className="py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <p className="text-[#c9a050] text-lg font-medium mb-4">
                                {t.various_units}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                            {projects.slice(0, 8).map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group flex flex-col items-center text-center p-6 hover:bg-gray-50 rounded-lg transition-all"
                                >
                                    <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-lg">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {project.is_featured && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a050] rounded-full"></div>
                                        )}
                                    </div>
                                    <h3 className="text-gray-900 font-semibold text-lg group-hover:text-[#c9a050] transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {project.location} • {project.area_sqm} {t.sqm}
                                    </p>
                                    <p className="text-[#c9a050] text-sm mt-1 font-medium">
                                        {t.from} ${project.price_starts_at}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                href="#"
                                className="inline-block border-2 border-[#c9a050] text-[#c9a050] hover:bg-[#c9a050] hover:text-white px-8 py-3 rounded font-medium transition-all"
                            >
                                {t.view_all}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Properties Grid Section */}
                <section className="py-20 bg-[#f5f5f5]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                            {t.our_properties}
                        </h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-[#c9a050] text-white px-3 py-1 rounded text-sm font-medium">
                                            {t.from} ${project.price_starts_at}
                                        </div>
                                        {project.is_featured && (
                                            <div className="absolute top-4 left-4 bg-white/90 text-[#c9a050] px-2 py-1 rounded text-xs font-semibold">
                                                ★ {t.featured_property}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#c9a050] transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-3">
                                            {project.location}
                                        </p>
                                        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                                            {project.bedrooms !== null && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    {project.bedrooms} {t.bedrooms}
                                                </span>
                                            )}
                                            {project.area_sqm && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                    </svg>
                                                    {project.area_sqm} {t.sqm}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[#c9a050]">
                                            <span className="text-sm font-medium">{t.read_more}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 bg-[#1a1a1a]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                                <img
                                    src={featuredProjects[0]?.image_url || projects[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                                    alt="Featured Project"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors">
                                    <div className="w-16 h-16 bg-[#c9a050] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#c9a050] mb-4">
                                    {t.about_title}
                                </h2>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {t.about_description}
                                </p>
                                <Link
                                    href="#contact"
                                    className="inline-flex items-center gap-2 text-[#c9a050] hover:text-[#b8923a] font-medium transition-colors"
                                >
                                    {t.read_more}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                            {t.get_in_touch}
                        </h2>
                        <p className="text-gray-600 text-center mb-12">
                            {t.get_in_touch_desc}
                        </p>
                        
                        <form onSubmit={handleContactSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-lg">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t.your_name}
                                        className={`w-full px-4 py-3 border rounded focus:border-[#c9a050] focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t.your_email}
                                        className={`w-full px-4 py-3 border rounded focus:border-[#c9a050] focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder={t.your_phone}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#c9a050] focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder={t.your_message}
                                    className={`w-full px-4 py-3 border rounded focus:border-[#c9a050] focus:outline-none transition-all resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#c9a050] hover:bg-[#b8923a] text-white font-semibold py-3 px-6 rounded transition-all hover:shadow-lg disabled:opacity-50"
                            >
                                {processing ? t.sending + '...' : t.send_message}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#1a1a1a] text-white py-16 border-t border-[#c9a050]/20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="md:col-span-1">
                                <div className="text-[#c9a050] font-bold text-2xl mb-2">
                                    {t.brand_name}
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {t.brand_tagline}
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-[#c9a050] font-semibold mb-4">{t.payment_methods}</h3>
                                <div className="flex gap-3">
                                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <span className="text-xs text-gray-400">VISA</span>
                                    </div>
                                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <span className="text-xs text-gray-400">MC</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[#c9a050] font-semibold mb-4">{t.follow_us}</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="text-gray-400 hover:text-[#c9a050] transition-colors">FB</a>
                                    <a href="#" className="text-gray-400 hover:text-[#c9a050] transition-colors">IG</a>
                                    <a href="#" className="text-gray-400 hover:text-[#c9a050] transition-colors">TW</a>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[#c9a050] font-semibold mb-4">{t.contact_info}</h3>
                                <div className="space-y-2 text-gray-400 text-sm">
                                    <p>(02) 19691</p>
                                    <p>info@alnader.com</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                            <p>{t.copyright?.replace(':year', new Date().getFullYear().toString()) || '© 2026 Al-Nader. All rights reserved.'}</p>
                        </div>
                    </div>
                </footer>

                {/* Floating Reserve Button */}
                <Link
                    href="#contact"
                    className="fixed bottom-6 right-6 bg-[#c9a050] hover:bg-[#b8923a] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all hover:shadow-xl z-50"
                >
                    {t.reserve_unit}
                </Link>
            </div>
        </>
    );
}
