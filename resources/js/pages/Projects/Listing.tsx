import { Navbar } from '@/components/Navbar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
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
    propertyTypes: string[];
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

export default function Listing({ projects, propertyTypes, filters }: Props) {
    const { locale, translations: t, availableLocales, localeNames, flash } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';

    const initialArea = Number(filters.min_area ?? '50');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [areaRange, setAreaRange] = useState(Number.isFinite(initialArea) && initialArea >= 50 ? initialArea : 50);

    const lastSuccessToastRef = useRef<string | null>(null);

    useEffect(() => {
        const successMessage = flash?.success;
        if (!successMessage || lastSuccessToastRef.current === successMessage) return;
        toast.success(successMessage, { duration: 5000, position: 'top-center' });
        lastSuccessToastRef.current = successMessage;
    }, [flash?.success]);

    const handleSearch = () => {
        router.get(
            '/projects',
            {
                type: selectedType || undefined,
                min_area: areaRange > 50 ? areaRange : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

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

    return (
        <>
            <Head title={t.page_title_projects} />
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

                {/* ─── Page Title + Search Filter Bar ─── */}
                <section className="bg-[#0a0a0a] pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <h1 className="animate-on-scroll mb-10 font-serif font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            {t.our_properties}
                        </h1>

                        {/* Search filter row */}
                        <div className="animate-on-scroll border-t border-[#c9a050]/10">
                            <div className="py-7">
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#c9a050]/60 uppercase">
                                        {t.search_your_unit}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                                            {t.type}
                                        </label>
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
                    </div>
                </section>

                {/* ─── Project Cards Grid ─── */}
                <section className="geo-pattern bg-[#f4ede0] py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        {projects.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-lg text-white/50">No projects match your filters.</p>
                            </div>
                        ) : (
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
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
