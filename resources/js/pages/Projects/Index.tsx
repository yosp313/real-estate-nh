import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
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
    flash?: { success?: string | null; error?: string | null };
    [key: string]: unknown;
}

export default function Index({ projects, allProjects, propertyTypes, filters }: Props) {
    const { locale, translations: t, availableLocales, localeNames, flash } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    const lastSuccessToastRef = useRef<string | null>(null);
    const lastFlashErrorToastRef = useRef<string | null>(null);
    const lastValidationErrorToastRef = useRef<string | null>(null);

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
            },
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const successMessage = flash?.success;

        if (!successMessage || lastSuccessToastRef.current === successMessage) {
            return;
        }

        toast.success(successMessage, {
            duration: 5000,
            position: 'top-center',
            icon: '✅',
        });
        lastSuccessToastRef.current = successMessage;
    }, [flash?.success]);

    useEffect(() => {
        const errorMessage = flash?.error;

        if (!errorMessage || lastFlashErrorToastRef.current === errorMessage) {
            return;
        }

        toast.error(errorMessage, {
            duration: 5000,
            position: 'top-center',
        });
        lastFlashErrorToastRef.current = errorMessage;
    }, [flash?.error]);

    useEffect(() => {
        const messages = Object.values(errors).filter((message): message is string => typeof message === 'string' && message.length > 0);

        if (messages.length === 0) {
            lastValidationErrorToastRef.current = null;

            return;
        }

        const signature = messages.join('|');

        if (lastValidationErrorToastRef.current === signature) {
            return;
        }

        toast.error(messages[0], {
            duration: 5000,
            position: 'top-center',
        });
        lastValidationErrorToastRef.current = signature;
    }, [errors]);

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

            <div className={`min-h-screen [scroll-behavior:smooth] bg-[#0d0d0d] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Navigation */}
                <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#c9a050]/20 bg-[#1a1a1a]/95 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="text-xl font-bold text-[#c9a050]">{t.brand_name}</div>
                            </Link>

                            <div className="hidden items-center gap-8 md:flex">
                                <Link href="/" className="text-sm font-medium text-white transition-colors duration-200 hover:text-[#c9a050]">
                                    {t.home}
                                </Link>
                                <a href="#projects" className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-[#c9a050]">
                                    {t.properties}
                                </a>
                                <a href="#about" className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-[#c9a050]">
                                    {t.about}
                                </a>
                                <a href="#contact" className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-[#c9a050]">
                                    {t.contact}
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center overflow-hidden rounded border border-[#c9a050]/30">
                                    {availableLocales.map((loc) => (
                                        <Link
                                            key={loc}
                                            href={`/locale/${loc}`}
                                            className={`cursor-pointer px-3 py-1.5 text-xs transition-colors duration-200 ${
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
                        <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                            <span className="bg-gradient-to-r from-white via-[#e8c97a] to-[#c9a050] bg-clip-text text-transparent">
                                {t.hero_title}
                            </span>
                        </h1>
                        <p className="mb-12 text-xl font-medium text-[#c9a050] md:text-2xl">{t.hero_subtitle}</p>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 motion-safe:animate-bounce">
                        <div className="flex flex-col items-center gap-1 opacity-60">
                            <div className="h-8 w-px bg-[#c9a050]"></div>
                            <svg className="h-4 w-4 text-[#c9a050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
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

                {/* Stats / Trust Bar */}
                <section className="border-y border-[#c9a050]/20 bg-[#1a1a1a] py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[
                                { number: '150+', label: t.stat_projects_label },
                                { number: '12+', label: t.stat_years_label },
                                { number: '500+', label: t.stat_clients_label },
                                { number: '5★', label: t.stat_rating_label },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="mb-1 text-3xl font-bold text-[#c9a050] md:text-4xl">{stat.number}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-lg font-medium text-[#c9a050]">{t.various_units}</p>
                        </div>

                        <div className="mb-10 flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
                            {projects.slice(0, 8).map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="group relative min-w-[220px] cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a050]/40 hover:shadow-xl md:min-w-0"
                                >
                                    <div className="relative aspect-[3/2] overflow-hidden">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {project.is_featured && (
                                            <div className="absolute top-2 left-2 rounded-full bg-[#c9a050] px-2 py-0.5 text-xs font-semibold text-white">
                                                ★
                                            </div>
                                        )}
                                        {project.type && (
                                            <div className="absolute top-2 right-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                                                {t[project.type] || project.type}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#c9a050]">
                                            {project.name}
                                        </h3>
                                        {project.location && <p className="mb-2 text-xs text-gray-500">{project.location}</p>}
                                        <p className="text-sm font-medium text-[#c9a050]">
                                            {t.from} ${project.price_starts_at}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <a
                                href="#all-properties"
                                className="inline-block cursor-pointer rounded border-2 border-[#c9a050] px-8 py-3 font-medium text-[#c9a050] transition-all hover:bg-[#c9a050] hover:text-white"
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
                                    className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
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
                                        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#c9a050]">
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
                                <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-colors duration-200 hover:bg-black/40">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c9a050] transition-transform hover:scale-110">
                                        <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                <div className={`mb-4 h-1 w-16 rounded-full bg-[#c9a050] ${isRTL ? 'mr-auto' : ''}`}></div>
                                <h2 className="mb-4 text-3xl font-bold text-[#c9a050] md:text-4xl">{t.about_title}</h2>
                                <p className="mb-6 leading-[1.75] text-gray-300">{t.about_description}</p>
                                <a
                                    href="#contact"
                                    className="inline-flex cursor-pointer items-center gap-2 font-medium text-[#c9a050] transition-colors duration-200 hover:text-[#b8923a]"
                                >
                                    {t.read_more}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-[#0d0d0d] py-20">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[#c9a050]"></div>
                            <h2 className="mb-3 text-3xl font-bold text-white">{t.get_in_touch}</h2>
                            <p className="text-gray-400">{t.get_in_touch_desc}</p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#c9a050]/20 lg:grid lg:grid-cols-5">
                            <div className="bg-[#c9a050] p-10 lg:col-span-2">
                                <h3 className="mb-6 text-xl font-bold text-[#1a1a1a]">{t.contact_info}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-[#1a1a1a]/70 uppercase">{t.phone}</p>
                                            <p className="mt-0.5 font-medium text-[#1a1a1a]">(02) 19691</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-[#1a1a1a]/70 uppercase">{t.email}</p>
                                            <p className="mt-0.5 font-medium text-[#1a1a1a]">info@alnader.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] p-10 lg:col-span-3">
                                <form onSubmit={handleContactSubmit} className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder={t.your_name}
                                                className={`w-full rounded border bg-[#2d2d2d] px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-[#c9a050] focus:outline-none ${errors.name ? 'border-red-500' : 'border-[#3d3d3d]'}`}
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder={t.your_email}
                                                className={`w-full rounded border bg-[#2d2d2d] px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-[#c9a050] focus:outline-none ${errors.email ? 'border-red-500' : 'border-[#3d3d3d]'}`}
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
                                            className="w-full rounded border border-[#3d3d3d] bg-[#2d2d2d] px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-[#c9a050] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder={t.your_message}
                                            className={`w-full resize-none rounded border bg-[#2d2d2d] px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-[#c9a050] focus:outline-none ${errors.message ? 'border-red-500' : 'border-[#3d3d3d]'}`}
                                        />
                                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer rounded bg-[#c9a050] px-6 py-3 font-semibold text-[#1a1a1a] transition-all hover:bg-[#b8923a] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? t.sending + '...' : t.send_message}
                                    </button>
                                </form>
                            </div>
                        </div>
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
                                    <div className="flex h-8 w-14 items-center justify-center rounded border border-white/20 bg-white/10">
                                        <span className="text-xs font-bold tracking-wide text-white italic">VISA</span>
                                    </div>
                                    <div className="flex h-8 w-14 items-center justify-center rounded border border-white/20 bg-white/10">
                                        <span className="text-xs font-bold tracking-wide text-white">MC</span>
                                    </div>
                                    <div className="flex h-8 w-14 items-center justify-center rounded border border-white/20 bg-white/10">
                                        <span className="text-xs font-bold tracking-wide text-white">CASH</span>
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
                                        aria-label="Facebook"
                                        className="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-[#c9a050]"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Instagram"
                                        className="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-[#c9a050]"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://x.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="X (Twitter)"
                                        className="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-[#c9a050]"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
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
                    className="fixed right-6 bottom-6 z-50 cursor-pointer rounded-full bg-[#c9a050] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#b8923a] hover:shadow-xl"
                >
                    {t.reserve_unit}
                </a>
            </div>
        </>
    );
}
