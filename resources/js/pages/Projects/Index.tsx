import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
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
    const { locale, translations: t, availableLocales, localeNames } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';

    // Search filters
    const initialArea = Number(filters.min_area ?? '50');
    const [selectedProject, setSelectedProject] = useState(filters.project || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [areaRange, setAreaRange] = useState(Number.isFinite(initialArea) && initialArea >= 50 ? initialArea : 50);

    // Contact form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSearch = () => {
        router.get(
            '/',
            {
                project: selectedProject || undefined,
                type: selectedType || undefined,
                min_area: areaRange > 50 ? areaRange : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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
    const featuredProjects = projects.filter((p) => p.is_featured);

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
                <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#c9a050]/20 bg-[#1a1a1a]/95 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="text-xl font-bold text-[#c9a050]">{t.brand_name}</div>
                            </Link>

                            <div className="hidden items-center gap-8 md:flex">
                                <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-[#c9a050]">
                                    {t.home}
                                </Link>
                                <a href="#projects" className="text-sm font-medium text-gray-300 transition-colors hover:text-[#c9a050]">
                                    {t.properties}
                                </a>
                                <a href="#about" className="text-sm font-medium text-gray-300 transition-colors hover:text-[#c9a050]">
                                    {t.about}
                                </a>
                                <a href="#contact" className="text-sm font-medium text-gray-300 transition-colors hover:text-[#c9a050]">
                                    {t.contact}
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center overflow-hidden rounded border border-[#c9a050]/30">
                                    {availableLocales.map((loc) => (
                                        <Link
                                            key={loc}
                                            href={`/locale/${loc}`}
                                            className={`px-3 py-1.5 text-xs transition-colors ${
                                                locale === loc ? 'bg-[#c9a050] font-semibold text-[#1a1a1a]' : 'text-gray-300 hover:text-white'
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
                <section className="relative flex min-h-screen items-center justify-center pt-16">
                    <div className="absolute inset-0">
                        <img
                            src={
                                featuredProjects[0]?.image_url ||
                                projects[0]?.image_url ||
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'
                            }
                            alt="Hero"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                        <h1 className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">{t.hero_title}</h1>
                        <p className="mb-12 text-xl font-medium text-[#c9a050] md:text-2xl">{t.hero_subtitle}</p>
                    </div>

                    {/* Search Filter Bar */}
                    <div className="absolute right-0 bottom-0 left-0 border-t border-[#c9a050]/20 bg-[#1a1a1a]/95 backdrop-blur-md">
                        <div className="mx-auto max-w-6xl px-4 py-6">
                            <div className="mb-4 flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-[#c9a050]">{t.search_your_unit}</span>
                            </div>

                            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">{t.project}</label>
                                    <select
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        className="w-full rounded border border-[#3d3d3d] bg-[#2d2d2d] px-4 py-3 text-white focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="">{t.all}</option>
                                        {allProjects.map((project) => (
                                            <option key={project.id} value={project.slug}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">{t.type}</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full rounded border border-[#3d3d3d] bg-[#2d2d2d] px-4 py-3 text-white focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="">{t.all}</option>
                                        {propertyTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {t[type] || type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">
                                        {t.area} -{' '}
                                        <span className="text-[#c9a050]">
                                            {areaRange}+ {t.sqm}
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="500"
                                        value={areaRange}
                                        onChange={(e) => setAreaRange(parseInt(e.target.value))}
                                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#3d3d3d]"
                                    />
                                </div>

                                <div>
                                    <button
                                        onClick={handleSearch}
                                        className="w-full rounded bg-[#c9a050] px-6 py-3 font-semibold text-[#1a1a1a] transition-all hover:bg-[#d4a84a]"
                                    >
                                        {t.search}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-lg font-medium text-[#c9a050]">{t.various_units}</p>
                        </div>

                        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                            {projects.slice(0, 8).map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group flex flex-col items-center rounded-lg p-6 text-center transition-all hover:bg-gray-50"
                                >
                                    <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-lg">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {project.is_featured && <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#c9a050]"></div>}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#c9a050]">
                                        {project.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {project.location} • {project.area_sqm} {t.sqm}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-[#c9a050]">
                                        {t.from} ${project.price_starts_at}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <a
                                href="#all-properties"
                                className="inline-block rounded border-2 border-[#c9a050] px-8 py-3 font-medium text-[#c9a050] transition-all hover:bg-[#c9a050] hover:text-white"
                            >
                                {t.view_all}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Properties Grid Section */}
                <section id="all-properties" className="bg-[#f5f5f5] py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">{t.our_properties}</h2>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 rounded bg-[#c9a050] px-3 py-1 text-sm font-medium text-white">
                                            {t.from} ${project.price_starts_at}
                                        </div>
                                        {project.is_featured && (
                                            <div className="absolute top-4 left-4 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-[#c9a050]">
                                                ★ {t.featured_property}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#c9a050]">
                                            {project.name}
                                        </h3>
                                        <p className="mb-3 text-sm text-gray-500">{project.location}</p>
                                        <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                                            {project.bedrooms !== null && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                        />
                                                    </svg>
                                                    {project.bedrooms} {t.bedrooms}
                                                </span>
                                            )}
                                            {project.area_sqm && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                        />
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
                <section id="about" className="bg-[#1a1a1a] py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="relative aspect-video overflow-hidden rounded-lg shadow-2xl">
                                <img
                                    src={
                                        featuredProjects[0]?.image_url ||
                                        projects[0]?.image_url ||
                                        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
                                    }
                                    alt="Featured Project"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-colors hover:bg-black/40">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c9a050] transition-transform hover:scale-110">
                                        <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h2 className="mb-4 text-3xl font-bold text-[#c9a050] md:text-4xl">{t.about_title}</h2>
                                <p className="mb-6 leading-relaxed text-gray-300">{t.about_description}</p>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 font-medium text-[#c9a050] transition-colors hover:text-[#b8923a]"
                                >
                                    {t.read_more}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-white py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">{t.get_in_touch}</h2>
                        <p className="mb-12 text-center text-gray-600">{t.get_in_touch_desc}</p>

                        <form onSubmit={handleContactSubmit} className="space-y-6 rounded-lg bg-gray-50 p-8 shadow-lg">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t.your_name}
                                        className={`w-full rounded border px-4 py-3 transition-all focus:border-[#c9a050] focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t.your_email}
                                        className={`w-full rounded border px-4 py-3 transition-all focus:border-[#c9a050] focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                                    className="w-full rounded border border-gray-300 px-4 py-3 transition-all focus:border-[#c9a050] focus:outline-none"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder={t.your_message}
                                    className={`w-full resize-none rounded border px-4 py-3 transition-all focus:border-[#c9a050] focus:outline-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded bg-[#c9a050] px-6 py-3 font-semibold text-white transition-all hover:bg-[#b8923a] hover:shadow-lg disabled:opacity-50"
                            >
                                {processing ? t.sending + '...' : t.send_message}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#c9a050]/20 bg-[#1a1a1a] py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
                            <div className="md:col-span-1">
                                <div className="mb-2 text-2xl font-bold text-[#c9a050]">{t.brand_name}</div>
                                <p className="text-sm text-gray-400">{t.brand_tagline}</p>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold text-[#c9a050]">{t.payment_methods}</h3>
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10">
                                        <span className="text-xs text-gray-400">VISA</span>
                                    </div>
                                    <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10">
                                        <span className="text-xs text-gray-400">MC</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold text-[#c9a050]">{t.follow_us}</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 transition-colors hover:text-[#c9a050]"
                                    >
                                        FB
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 transition-colors hover:text-[#c9a050]"
                                    >
                                        IG
                                    </a>
                                    <a
                                        href="https://x.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 transition-colors hover:text-[#c9a050]"
                                    >
                                        TW
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold text-[#c9a050]">{t.contact_info}</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>(02) 19691</p>
                                    <p>info@alnader.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                            <p>{t.copyright?.replace(':year', new Date().getFullYear().toString()) || '© 2026 Al-Nader. All rights reserved.'}</p>
                        </div>
                    </div>
                </footer>

                {/* Floating Reserve Button */}
                <a
                    href="#contact"
                    className="fixed right-6 bottom-6 z-50 rounded-full bg-[#c9a050] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#b8923a] hover:shadow-xl"
                >
                    {t.reserve_unit}
                </a>
            </div>
        </>
    );
}
