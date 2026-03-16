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
            icon: '\u2705',
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

    // Scroll-triggered animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
        );

        const elements = document.querySelectorAll('.animate-on-scroll, .animate-scale-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [projects]);

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
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                    },
                    success: {
                        iconTheme: { primary: '#c9a050', secondary: '#1a1a1a' },
                    },
                    error: {
                        iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
                    },
                }}
            />

            <div className={`grain-overlay min-h-screen [scroll-behavior:smooth] bg-[#080808] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* ─── Navigation ─── */}
                <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#c9a050]/10 bg-[#080808]/90 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="font-serif text-2xl font-bold tracking-wide text-[#c9a050]">{t.brand_name}</div>
                            </Link>

                            <div className="hidden items-center gap-10 md:flex">
                                {[
                                    { href: '/', label: t.home, isLink: true },
                                    { href: '#projects', label: t.properties, isLink: false },
                                    { href: '#about', label: t.about, isLink: false },
                                    { href: '#contact', label: t.contact, isLink: false },
                                ].map((item) =>
                                    item.isLink ? (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="hover-gold-underline text-sm font-medium tracking-widest text-white/90 uppercase transition-colors duration-300 hover:text-[#c9a050]"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="hover-gold-underline text-sm font-medium tracking-widest text-white/60 uppercase transition-colors duration-300 hover:text-[#c9a050]"
                                        >
                                            {item.label}
                                        </a>
                                    ),
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center overflow-hidden rounded-full border border-[#c9a050]/20">
                                    {availableLocales.map((loc) => (
                                        <Link
                                            key={loc}
                                            href={`/locale/${loc}`}
                                            className={`cursor-pointer px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                                                locale === loc ? 'bg-[#c9a050] font-semibold text-[#080808]' : 'text-white/50 hover:text-white'
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

                {/* ─── Hero Section ─── */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0">
                        <img
                            src={
                                featuredProjects[0]?.image_url ||
                                projects[0]?.image_url ||
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'
                            }
                            alt="Hero"
                            className="h-full w-full scale-105 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/50 via-[#080808]/20 to-[#080808]/90"></div>
                    </div>

                    {/* Geometric corner accents */}
                    <div className="absolute top-24 left-8 hidden lg:block">
                        <div className="h-24 w-24 border-t border-l border-[#c9a050]/30"></div>
                    </div>
                    <div className="absolute top-24 right-8 hidden lg:block">
                        <div className="h-24 w-24 border-t border-r border-[#c9a050]/30"></div>
                    </div>

                    <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                        <p className="animate-on-scroll mb-6 text-sm font-medium tracking-[0.3em] text-[#c9a050]/80 uppercase">{t.hero_subtitle}</p>
                        <h1
                            className="animate-on-scroll mb-8 font-serif text-5xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl"
                            data-delay="1"
                        >
                            <span className="gold-shimmer">{t.hero_title}</span>
                        </h1>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 motion-safe:animate-bounce">
                        <div className="flex flex-col items-center gap-2 opacity-50">
                            <div className="h-10 w-px bg-gradient-to-b from-transparent to-[#c9a050]"></div>
                            <svg className="h-3 w-3 text-[#c9a050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Search Filter Bar — floating glass card */}
                    <div className="absolute right-0 bottom-0 left-0 border-t border-[#c9a050]/10 bg-[#080808]/85 backdrop-blur-2xl">
                        <div className="mx-auto max-w-6xl px-6 py-8">
                            <div className="mb-5 flex items-center justify-end gap-2">
                                <span className="text-xs font-medium tracking-[0.2em] text-[#c9a050]/70 uppercase">{t.search_your_unit}</span>
                            </div>

                            <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-[10px] font-medium tracking-[0.15em] text-white/40 uppercase">
                                        {t.project}
                                    </label>
                                    <select
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        className="w-full border-b border-[#3d3d3d] bg-transparent px-0 py-3 text-sm text-white transition-colors focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a1a1a]">
                                            {t.all}
                                        </option>
                                        {allProjects.map((project) => (
                                            <option key={project.id} value={project.slug} className="bg-[#1a1a1a]">
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-medium tracking-[0.15em] text-white/40 uppercase">{t.type}</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full border-b border-[#3d3d3d] bg-transparent px-0 py-3 text-sm text-white transition-colors focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a1a1a]">
                                            {t.all}
                                        </option>
                                        {propertyTypes.map((type) => (
                                            <option key={type} value={type} className="bg-[#1a1a1a]">
                                                {t[type] || type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-medium tracking-[0.15em] text-white/40 uppercase">
                                        {t.area} &mdash;{' '}
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
                                        className="mt-2 w-full cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <button
                                        onClick={handleSearch}
                                        className="btn-gold w-full rounded-sm px-6 py-3 text-sm font-semibold tracking-wider text-white uppercase"
                                    >
                                        {t.search}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Stats Bar ─── */}
                <section className="geo-pattern-dark border-y border-[#c9a050]/10 bg-[#0d0d0d] py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[
                                { number: '150+', label: t.stat_projects_label },
                                { number: '12+', label: t.stat_years_label },
                                { number: '500+', label: t.stat_clients_label },
                                { number: '5\u2605', label: t.stat_rating_label },
                            ].map((stat, i) => (
                                <div key={stat.label} className="animate-on-scroll relative text-center" data-delay={i}>
                                    <div className="mb-2 font-serif text-4xl font-bold text-[#c9a050] md:text-5xl lg:text-6xl">{stat.number}</div>
                                    <div className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">{stat.label}</div>
                                    {/* Gold divider between stats (not after last) */}
                                    {i < 3 && (
                                        <div className="absolute top-1/2 right-0 hidden h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#c9a050]/20 to-transparent md:block"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Featured Projects Section ─── */}
                <section id="projects" className="bg-[#f7f3eb] py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="animate-on-scroll mb-16 text-center">
                            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#9a7830] uppercase">{t.various_units}</p>
                            <div className="mx-auto flex items-center justify-center gap-4">
                                <div className="h-px w-12 bg-[#c9a050]/40"></div>
                                <div className="h-1.5 w-1.5 rotate-45 bg-[#c9a050]"></div>
                                <div className="h-px w-12 bg-[#c9a050]/40"></div>
                            </div>
                        </div>

                        <div className="mb-12 flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
                            {projects.slice(0, 8).map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className={`animate-scale-reveal group relative min-w-[240px] cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-2xl md:min-w-0 ${
                                        i === 0 ? 'md:col-span-2 md:row-span-1' : ''
                                    }`}
                                    data-delay={i % 4}
                                >
                                    <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[16/10]' : 'aspect-[3/2]'}`}>
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gold gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                        {project.is_featured && (
                                            <div className="absolute top-3 left-3 rounded-sm bg-[#c9a050] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                                                {'\u2605'}
                                            </div>
                                        )}
                                        {project.type && (
                                            <div className="absolute top-3 right-3 rounded-sm bg-black/40 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white uppercase backdrop-blur-sm">
                                                {t[project.type] || project.type}
                                            </div>
                                        )}
                                        {/* Title slides up on hover */}
                                        <div className="absolute right-0 bottom-0 left-0 translate-y-full p-5 transition-transform duration-500 group-hover:translate-y-0">
                                            <h3 className="font-serif text-lg font-bold text-white">{project.name}</h3>
                                            <p className="mt-1 text-sm text-[#c9a050]">
                                                {t.from} ${project.price_starts_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-5 transition-colors duration-300 group-hover:bg-[#faf8f4]">
                                        <h3 className="mb-1 font-serif text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#9a7830]">
                                            {project.name}
                                        </h3>
                                        {project.location && <p className="mb-2 text-xs text-gray-400">{project.location}</p>}
                                        <p className="text-sm font-medium text-[#b8923a]">
                                            {t.from} ${project.price_starts_at}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="animate-on-scroll text-center">
                            <a
                                href="#all-properties"
                                className="group inline-flex cursor-pointer items-center gap-3 border-b-2 border-[#c9a050] pb-1 text-sm font-semibold tracking-widest text-[#9a7830] uppercase transition-all hover:border-[#9a7830] hover:text-[#7d612a]"
                            >
                                {t.view_all}
                                <svg
                                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* ─── All Properties Grid ─── */}
                <section id="all-properties" className="geo-pattern bg-[#f0ebe1] py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <h2 className="animate-on-scroll mb-14 text-center font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                            {t.our_properties}
                        </h2>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="animate-on-scroll group relative cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
                                    data-delay={i % 3}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Overlapping price badge */}
                                        <div className="absolute right-4 -bottom-5 z-10 rounded-sm bg-[#c9a050] px-4 py-2 text-sm font-bold text-white shadow-lg">
                                            {t.from} ${project.price_starts_at}
                                        </div>
                                        {project.is_featured && (
                                            <div className="absolute top-4 left-4 rounded-sm bg-white/95 px-3 py-1 text-[10px] font-bold tracking-wider text-[#c9a050] uppercase shadow-sm">
                                                {'\u2605'} {t.featured_property}
                                            </div>
                                        )}
                                    </div>
                                    {/* Gold border reveal from bottom on hover */}
                                    <div className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 bg-[#c9a050] transition-transform duration-500 group-hover:scale-x-100"></div>
                                    <div className="p-6 pt-8">
                                        <h3 className="mb-2 font-serif text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#9a7830]">
                                            {project.name}
                                        </h3>
                                        <p className="mb-4 text-xs text-gray-400">{project.location}</p>
                                        <div className="mb-4 flex items-center gap-5 text-sm text-gray-500">
                                            {project.bedrooms !== null && (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="h-4 w-4 text-[#c9a050]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                        />
                                                    </svg>
                                                    {project.bedrooms} {t.bedrooms}
                                                </span>
                                            )}
                                            {project.area_sqm && (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="h-4 w-4 text-[#c9a050]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                        />
                                                    </svg>
                                                    {project.area_sqm} {t.sqm}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[#b8923a]">
                                            <span className="text-xs font-semibold tracking-wider uppercase">{t.read_more}</span>
                                            <svg
                                                className={`h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── About Section ─── */}
                <section id="about" className="bg-[#0d0d0d] py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid items-center gap-16 lg:grid-cols-5">
                            {/* Image — 60% */}
                            <div className="animate-on-scroll relative lg:col-span-3">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={
                                            featuredProjects[0]?.image_url ||
                                            projects[0]?.image_url ||
                                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
                                        }
                                        alt="Featured Project"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-colors duration-300 hover:bg-black/20">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a050]/50 bg-[#c9a050]/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#c9a050]/30">
                                            <svg className="ml-1 h-5 w-5 text-[#c9a050]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Geometric frame accent */}
                                <div className="absolute -top-3 -left-3 hidden h-16 w-16 border-t-2 border-l-2 border-[#c9a050]/30 lg:block"></div>
                                <div className="absolute -right-3 -bottom-3 hidden h-16 w-16 border-r-2 border-b-2 border-[#c9a050]/30 lg:block"></div>
                            </div>

                            {/* Content — 40% */}
                            <div className={`animate-on-scroll lg:col-span-2 ${isRTL ? 'text-right' : 'text-left'}`} data-delay="2">
                                <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="h-px w-10 bg-[#c9a050]"></div>
                                    <span className="text-[10px] font-semibold tracking-[0.3em] text-[#c9a050] uppercase">{t.about}</span>
                                </div>
                                <h2 className="mb-6 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                    <span className="text-gold-gradient">{t.about_title}</span>
                                </h2>
                                <p className="mb-8 text-base leading-[2] tracking-wide text-gray-400">{t.about_description}</p>
                                <a
                                    href="#contact"
                                    className="group inline-flex cursor-pointer items-center gap-3 text-sm font-semibold tracking-wider text-[#c9a050] uppercase transition-colors duration-300 hover:text-[#e8c254]"
                                >
                                    {t.read_more}
                                    <svg
                                        className={`h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Contact Section ─── */}
                <section id="contact" className="relative bg-[#080808] py-24">
                    {/* Top gold accent strip */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#c9a050] to-transparent"></div>

                    <div className="mx-auto max-w-6xl px-6 lg:px-10">
                        <div className="animate-on-scroll mb-14 text-center">
                            <div className="mx-auto mb-6 flex items-center justify-center gap-4">
                                <div className="h-px w-12 bg-[#c9a050]/40"></div>
                                <div className="h-1.5 w-1.5 rotate-45 bg-[#c9a050]"></div>
                                <div className="h-px w-12 bg-[#c9a050]/40"></div>
                            </div>
                            <h2 className="mb-3 font-serif text-3xl font-bold text-white md:text-4xl">{t.get_in_touch}</h2>
                            <p className="mx-auto max-w-md text-sm leading-relaxed text-white/40">{t.get_in_touch_desc}</p>
                        </div>

                        <div className="animate-on-scroll overflow-hidden lg:grid lg:grid-cols-5" data-delay="1">
                            {/* Contact Info Panel — with pattern */}
                            <div className="geo-pattern-dark relative bg-[#c9a050] p-10 lg:col-span-2">
                                <h3 className="mb-8 font-serif text-xl font-bold text-[#080808]">{t.contact_info}</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-[#080808]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#080808]/50 uppercase">{t.phone}</p>
                                            <p className="mt-1 font-medium text-[#080808]">(02) 19691</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-[#080808]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#080808]/50 uppercase">{t.email}</p>
                                            <p className="mt-1 font-medium text-[#080808]">info@alnader.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="border border-l-0 border-[#c9a050]/10 bg-[#0d0d0d] p-10 lg:col-span-3">
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder={t.your_name}
                                                className={`w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-all placeholder:text-white/30 focus:outline-none ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'}`}
                                            />
                                            {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder={t.your_email}
                                                className={`w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-all placeholder:text-white/30 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'}`}
                                            />
                                            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t.your_phone}
                                            className="w-full border-b border-[#3d3d3d] bg-transparent px-0 py-3 text-sm text-white transition-all placeholder:text-white/30 focus:border-[#c9a050] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder={t.your_message}
                                            className={`w-full resize-none border-b bg-transparent px-0 py-3 text-sm text-white transition-all placeholder:text-white/30 focus:outline-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'}`}
                                        />
                                        {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-gold w-full cursor-pointer rounded-sm px-6 py-4 text-sm font-bold tracking-wider text-white uppercase disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? t.sending + '...' : t.send_message}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="bg-[#0d0d0d] py-20 text-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        {/* Geometric divider */}
                        <div className="mb-16 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a050]/20"></div>
                            <div className="h-2 w-2 rotate-45 bg-[#c9a050]/40"></div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a050]/20"></div>
                        </div>

                        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                            {/* Brand */}
                            <div>
                                <div className="mb-3 font-serif text-3xl font-bold text-[#c9a050]">{t.brand_name}</div>
                                <p className="max-w-xs text-sm leading-relaxed text-white/30">{t.brand_tagline}</p>
                            </div>

                            {/* Quick Links & Payment */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="mb-5 text-[10px] font-bold tracking-[0.2em] text-[#c9a050] uppercase">{t.payment_methods}</h3>
                                    <div className="flex gap-3">
                                        {['VISA', 'MC', 'CASH'].map((method) => (
                                            <div
                                                key={method}
                                                className="flex h-8 w-14 items-center justify-center rounded-sm border border-white/10 bg-white/5"
                                            >
                                                <span className="text-[10px] font-bold tracking-wider text-white/50">{method}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-5 text-[10px] font-bold tracking-[0.2em] text-[#c9a050] uppercase">{t.follow_us}</h3>
                                    <div className="flex gap-4">
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Facebook"
                                            className="cursor-pointer text-white/30 transition-colors duration-300 hover:text-[#c9a050]"
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
                                            className="cursor-pointer text-white/30 transition-colors duration-300 hover:text-[#c9a050]"
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
                                            className="cursor-pointer text-white/30 transition-colors duration-300 hover:text-[#c9a050]"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="mb-5 text-[10px] font-bold tracking-[0.2em] text-[#c9a050] uppercase">{t.contact_info}</h3>
                                <div className="space-y-3 text-sm text-white/30">
                                    <p>(02) 19691</p>
                                    <p>info@alnader.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8 text-center text-xs tracking-wider text-white/20">
                            <p>
                                {t.copyright?.replace(':year', new Date().getFullYear().toString()) || '\u00A9 2026 Al-Nader. All rights reserved.'}
                            </p>
                        </div>
                    </div>
                </footer>

                {/* ─── Floating CTA ─── */}
                <a href="#contact" className="floating-cta pulse-shadow cursor-pointer text-sm font-semibold tracking-wider uppercase">
                    {t.reserve_unit}
                </a>
            </div>
        </>
    );
}
