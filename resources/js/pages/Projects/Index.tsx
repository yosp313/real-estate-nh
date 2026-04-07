import { Navbar } from '@/components/Navbar';
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

export default function Index({ projects, propertyTypes, filters }: Props) {
    const { locale, translations: t, availableLocales, localeNames, flash } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    const lastSuccessToastRef = useRef<string | null>(null);
    const lastFlashErrorToastRef = useRef<string | null>(null);
    const lastValidationErrorToastRef = useRef<string | null>(null);

    const initialArea = Number(filters.min_area ?? '50');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [areaRange, setAreaRange] = useState(Number.isFinite(initialArea) && initialArea >= 50 ? initialArea : 50);

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
                type: selectedType || undefined,
                min_area: areaRange > 50 ? areaRange : undefined,
            },
            { preserveState: true, preserveScroll: true },
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
        if (!successMessage || lastSuccessToastRef.current === successMessage) return;
        toast.success(successMessage, { duration: 5000, position: 'top-center' });
        lastSuccessToastRef.current = successMessage;
    }, [flash?.success]);

    useEffect(() => {
        const errorMessage = flash?.error;
        if (!errorMessage || lastFlashErrorToastRef.current === errorMessage) return;
        toast.error(errorMessage, { duration: 5000, position: 'top-center' });
        lastFlashErrorToastRef.current = errorMessage;
    }, [flash?.error]);

    useEffect(() => {
        const messages = Object.values(errors).filter((m): m is string => typeof m === 'string' && m.length > 0);
        if (messages.length === 0) {
            lastValidationErrorToastRef.current = null;
            return;
        }
        const signature = messages.join('|');
        if (lastValidationErrorToastRef.current === signature) return;
        toast.error(messages[0], { duration: 5000, position: 'top-center' });
        lastValidationErrorToastRef.current = signature;
    }, [errors]);

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
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
        );
        const elements = document.querySelectorAll('.animate-on-scroll, .animate-scale-reveal');
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [projects]);

    const featuredProjects = projects.filter((p) => p.is_featured);

    return (
        <>
            <Head title={t.page_title} />
            <Toaster
                toastOptions={{
                    style: {
                        background: '#111111',
                        color: '#ffffff',
                        border: '1px solid rgba(201,160,80,0.4)',
                        fontFamily: "'Josefin Sans', system-ui, sans-serif",
                        fontSize: '13px',
                        letterSpacing: '0.04em',
                    },
                    success: { iconTheme: { primary: '#c9a050', secondary: '#111111' } },
                    error: { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } },
                }}
            />

            <div className={`grain-overlay min-h-screen [scroll-behavior:smooth] bg-[#0a0a0a] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* ─── Navigation ─── */}
                <Navbar locale={locale} translations={t} availableLocales={availableLocales} localeNames={localeNames} />

                {/* ─── Hero ─── */}
                <section className="relative flex min-h-screen items-end overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={
                                featuredProjects[0]?.image_url ||
                                projects[0]?.image_url ||
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'
                            }
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-cover"
                        />
                        {/* Cinematic gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent cinematic-gradient" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-transparent cinematic-gradient" />
                    </div>

                    {/* Corner accents */}
                    <div className="geo-corner geo-corner-tl absolute top-6 left-6 hidden lg:block" />
                    <div className="geo-corner geo-corner-tr absolute top-6 right-6 hidden lg:block" />

                    {/* Hero Content */}
                    <div className="relative z-10 w-full pb-56">
                        <div className="mx-auto max-w-7xl px-6 lg:px-10">
                            <div className="max-w-3xl">
                                <p className="animate-on-scroll section-label mb-6 text-[#c9a050]/70">{t.hero_subtitle}</p>
                                <h1
                                    className="animate-on-scroll mb-6 font-serif leading-none tracking-tight"
                                    data-delay="1"
                                    style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 700 }}
                                >
                                    <span className="gold-shimmer">{t.hero_title}</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute right-10 bottom-56 hidden flex-col items-center gap-2 opacity-40 motion-safe:flex lg:flex">
                        <span className="text-[10px] font-semibold tracking-[0.3em] text-white uppercase" style={{ writingMode: 'vertical-rl' }}>
                            scroll
                        </span>
                        <div className="h-16 w-px bg-gradient-to-b from-transparent to-[#c9a050]" />
                    </div>

                    {/* ─── Search Filter Bar ─── */}
                    <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-[#c9a050]/10 bg-[#0a0a0a]/90 backdrop-blur-2xl">
                        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-10">
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#c9a050]/60 uppercase">{t.search_your_unit}</span>
                            </div>
                            <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">{t.type}</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full cursor-pointer border-b border-[#2a2a2a] bg-transparent px-0 py-3 text-sm text-white transition-colors focus:border-[#c9a050] focus:outline-none"
                                    >
                                        <option value="" className="bg-[#111111]">
                                            {t.all}
                                        </option>
                                        {propertyTypes.map((type) => (
                                            <option key={type} value={type} className="bg-[#111111]">
                                                {t[type] || type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                                        {t.area}&nbsp;&mdash;&nbsp;
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
                                        className="mt-3 w-full cursor-pointer"
                                        aria-label={`${t.area} ${areaRange}+ ${t.sqm}`}
                                    />
                                </div>

                                <div>
                                    <button
                                        onClick={handleSearch}
                                        className="btn-gold w-full cursor-pointer px-6 py-3.5 text-xs font-semibold uppercase"
                                    >
                                        {t.search}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Stats Bar ─── */}
                <section className="border-b border-[#c9a050]/8 bg-[#0a0a0a] py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
                            {[
                                { number: '150+', label: t.stat_projects_label },
                                { number: '12+', label: t.stat_years_label },
                                { number: '500+', label: t.stat_clients_label },
                                { number: '5★', label: t.stat_rating_label },
                            ].map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="animate-on-scroll relative px-6 py-8 text-center first:pl-0 last:pr-0"
                                    data-delay={i}
                                >
                                    <div
                                        className="mb-2 font-serif font-bold text-[#c9a050]"
                                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1 }}
                                    >
                                        {stat.number}
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">{stat.label}</div>
                                    {i < 3 && (
                                        <div className="absolute top-1/2 right-0 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#c9a050]/15 to-transparent md:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Featured Projects ─── */}
                <section id="projects" className="bg-[#faf7f2] py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="animate-on-scroll mb-16 flex flex-col items-center gap-5 text-center">
                            <span className="section-label" style={{ color: '#9a7830' }}>
                                {t.various_units}
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="h-px w-10 bg-[#c9a050]/30" />
                                <div className="h-1.5 w-1.5 rotate-45 bg-[#c9a050]" />
                                <div className="h-px w-10 bg-[#c9a050]/30" />
                            </div>
                        </div>

                        <div className="mb-14 flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
                            {projects.slice(0, 8).map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className={`animate-scale-reveal group relative min-w-[240px] cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-xl md:min-w-0 ${
                                        i === 0 ? 'md:col-span-2' : ''
                                    }`}
                                    data-delay={i % 4}
                                >
                                    <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[16/10]' : 'aspect-[3/2]'}`}>
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/75 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                                        {project.is_featured && (
                                            <div className="absolute top-3 left-3 bg-[#c9a050] px-2.5 py-0.5 text-[9px] font-bold tracking-[0.15em] text-white uppercase">
                                                {t.featured_property}
                                            </div>
                                        )}
                                        {project.type && (
                                            <div className="absolute top-3 right-3 bg-black/40 px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                                                {t[project.type] || project.type}
                                            </div>
                                        )}
                                        <div className="absolute right-0 bottom-0 left-0 translate-y-full p-5 transition-transform duration-400 group-hover:translate-y-0">
                                            <h3 className="font-serif text-base font-bold text-white">{project.name}</h3>
                                            <p className="mt-0.5 text-sm text-[#c9a050]">
                                                {t.from} ${project.price_starts_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-5 transition-colors duration-200 group-hover:bg-[#fdf9f4]">
                                        <h3 className="mb-1 font-serif text-sm font-semibold text-gray-900 transition-colors duration-150 group-hover:text-[#9a7830]">
                                            {project.name}
                                        </h3>
                                        {project.location && <p className="mb-1.5 text-xs text-gray-400">{project.location}</p>}
                                        <p className="text-sm font-semibold text-[#b8923a]">
                                            {t.from} ${project.price_starts_at}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="animate-on-scroll text-center">
                            <a
                                href="#all-properties"
                                className="group inline-flex cursor-pointer items-center gap-3 border-b border-[#c9a050] pb-1 text-xs font-semibold tracking-[0.2em] text-[#9a7830] uppercase transition-all hover:gap-4"
                            >
                                {t.view_all}
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* ─── All Properties ─── */}
                <section id="all-properties" className="geo-pattern bg-[#f4ede0] py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <h2 className="animate-on-scroll mb-16 font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                            {t.our_properties}
                        </h2>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.slug}`}
                                    className="animate-on-scroll group relative flex cursor-pointer flex-col overflow-hidden bg-white shadow-sm transition-all duration-400 hover:shadow-xl"
                                    data-delay={i % 3}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                                        />
                                        <div className="absolute right-4 bottom-4 z-10 bg-[#c9a050] px-4 py-2 text-xs font-bold text-white shadow-lg">
                                            {t.from} ${project.price_starts_at}
                                        </div>
                                        {project.is_featured && (
                                            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-[#c9a050] uppercase shadow-sm">
                                                {t.featured_property}
                                            </div>
                                        )}
                                    </div>
                                    {/* Gold bottom border reveal */}
                                    <div className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 bg-[#c9a050] transition-transform duration-400 group-hover:scale-x-100" />
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="mb-1.5 font-serif text-lg font-bold text-gray-900 transition-colors duration-150 group-hover:text-[#9a7830]">
                                            {project.name}
                                        </h3>
                                        {project.location && <p className="mb-3 text-xs text-gray-400">{project.location}</p>}
                                        {(project.bedrooms !== null || project.area_sqm) && (
                                            <div className="mb-4 flex items-center gap-5 text-sm text-gray-500">
                                                {project.bedrooms !== null && (
                                                    <span className="flex items-center gap-1.5">
                                                        <svg
                                                            className="h-4 w-4 text-[#c9a050]/60"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            aria-hidden="true"
                                                        >
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
                                                        <svg
                                                            className="h-4 w-4 text-[#c9a050]/60"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            aria-hidden="true"
                                                        >
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
                                        )}
                                        <div className="mt-auto flex items-center gap-2 text-[#b8923a]">
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{t.read_more}</span>
                                            <svg
                                                className={`h-3 w-3 transition-transform duration-200 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
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
                <section id="about" className="bg-[#0a0a0a] py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid items-center gap-16 lg:grid-cols-5">
                            {/* Image */}
                            <div className="animate-on-scroll relative lg:col-span-3">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={
                                            featuredProjects[0]?.image_url ||
                                            projects[0]?.image_url ||
                                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
                                        }
                                        alt={t.about_title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 transition-colors duration-200 hover:bg-black/15">
                                        <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-[#c9a050]/50 bg-[#c9a050]/15 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-[#c9a050]/25">
                                            <svg className="ml-1 h-5 w-5 text-[#c9a050]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Corner accents */}
                                <div className="geo-corner geo-corner-tl absolute -top-3 -left-3 hidden lg:block" />
                                <div className="geo-corner geo-corner-br absolute -right-3 -bottom-3 hidden lg:block" />
                            </div>

                            {/* Content */}
                            <div className={`animate-on-scroll lg:col-span-2 ${isRTL ? 'text-right' : 'text-left'}`} data-delay="2">
                                <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="h-px w-8 bg-[#c9a050]" />
                                    <span className="text-[10px] font-bold tracking-[0.3em] text-[#c9a050] uppercase">{t.about}</span>
                                </div>
                                <h2 className="mb-6 font-serif leading-tight font-bold" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                                    <span className="text-gold-gradient">{t.about_title}</span>
                                </h2>
                                <p className="mb-8 text-sm leading-[2] tracking-wide text-white/50">{t.about_description}</p>
                                <a
                                    href="#contact"
                                    className="group inline-flex cursor-pointer items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#c9a050] uppercase transition-colors duration-200 hover:text-[#e8c254]"
                                >
                                    {t.read_more}
                                    <svg
                                        className={`h-3 w-3 transition-transform duration-200 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Contact Section ─── */}
                <section id="contact" className="relative bg-[#060606] py-28">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#c9a050]/30 to-transparent" />

                    <div className="mx-auto max-w-6xl px-6 lg:px-10">
                        <div className="animate-on-scroll mb-16 text-center">
                            <span className="section-label mb-5 inline-flex justify-center">{t.get_in_touch}</span>
                            <h2 className="mb-3 font-serif font-bold text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                                {t.get_in_touch}
                            </h2>
                            <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/35">{t.get_in_touch_desc}</p>
                        </div>

                        <div className="animate-on-scroll overflow-hidden lg:grid lg:grid-cols-5" data-delay="1">
                            {/* Contact Info */}
                            <div className="geo-pattern-dark relative bg-[#c9a050] p-10 lg:col-span-2">
                                <h3 className="mb-8 font-serif text-xl font-bold tracking-wide text-[#0a0a0a]">{t.contact_info}</h3>
                                <div className="space-y-7">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-[#0a0a0a]/60"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-[0.22em] text-[#0a0a0a]/50 uppercase">{t.phone}</p>
                                            <p className="mt-1 text-sm font-semibold text-[#0a0a0a]">(02) 19691</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-[#0a0a0a]/60"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-[0.22em] text-[#0a0a0a]/50 uppercase">{t.email}</p>
                                            <p className="mt-1 text-sm font-semibold text-[#0a0a0a]">info@alnader.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="border border-l-0 border-[#c9a050]/10 bg-[#0d0d0d] p-10 lg:col-span-3">
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="contact-name"
                                                className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                            >
                                                {t.your_name}
                                            </label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder={t.your_name}
                                                className={`w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                            />
                                            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="contact-email"
                                                className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                            >
                                                {t.your_email}
                                            </label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder={t.your_email}
                                                className={`w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                            />
                                            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="contact-phone"
                                            className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                        >
                                            {t.your_phone}
                                        </label>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t.your_phone}
                                            className="w-full border-b border-[#2a2a2a] bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:border-[#c9a050] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="contact-message"
                                            className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                        >
                                            {t.your_message}
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder={t.your_message}
                                            className={`w-full resize-none border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                        />
                                        {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-gold w-full cursor-pointer px-6 py-4 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? `${t.sending}...` : t.send_message}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="bg-[#060606] py-20 text-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="mb-14 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a050]/15" />
                            <div className="h-1.5 w-1.5 rotate-45 bg-[#c9a050]/30" />
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a050]/15" />
                        </div>

                        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-3">
                            <div>
                                <div className="mb-3 font-serif text-2xl font-bold tracking-widest text-[#c9a050] uppercase">{t.brand_name}</div>
                                <p className="max-w-xs text-sm leading-relaxed text-white/25">{t.brand_tagline}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="mb-5 text-[10px] font-bold tracking-[0.22em] text-[#c9a050] uppercase">{t.payment_methods}</h3>
                                    <div className="flex gap-2">
                                        {['VISA', 'MC', 'CASH'].map((method) => (
                                            <div key={method} className="flex h-7 w-12 items-center justify-center border border-white/8 bg-white/4">
                                                <span className="text-[9px] font-bold tracking-wider text-white/40">{method}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-5 text-[10px] font-bold tracking-[0.22em] text-[#c9a050] uppercase">{t.follow_us}</h3>
                                    <div className="flex gap-4">
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Facebook"
                                            className="cursor-pointer text-white/25 transition-colors duration-200 hover:text-[#c9a050]"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Instagram"
                                            className="cursor-pointer text-white/25 transition-colors duration-200 hover:text-[#c9a050]"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://x.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="X (Twitter)"
                                            className="cursor-pointer text-white/25 transition-colors duration-200 hover:text-[#c9a050]"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-5 text-[10px] font-bold tracking-[0.22em] text-[#c9a050] uppercase">{t.contact_info}</h3>
                                <div className="space-y-2.5 text-sm text-white/25">
                                    <p>(02) 19691</p>
                                    <p>info@alnader.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8 text-center text-xs tracking-widest text-white/18">
                            <p>
                                {t.copyright?.replace(':year', new Date().getFullYear().toString()) ||
                                    `\u00A9 ${new Date().getFullYear()} Al-Nader. All rights reserved.`}
                            </p>
                        </div>
                    </div>
                </footer>

                {/* ─── Floating CTA ─── */}
                <a href="#contact" className="floating-cta pulse-shadow">
                    {t.reserve_unit}
                </a>
            </div>
        </>
    );
}
