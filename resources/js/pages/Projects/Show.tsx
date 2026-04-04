import { Navbar } from '@/components/Navbar';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
    id: number;
    slug: string;
    name: string;
    description: string;
    type: string;
    area_sqm: number | null;
    location: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    is_featured: boolean;
    price_starts_at: string;
    image_url: string;
}

interface RelatedProject {
    id: number;
    slug: string;
    name: string;
    price_starts_at: string;
    image_url: string;
}

interface Props {
    project: Project;
    relatedProjects: RelatedProject[];
}

interface SharedProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
    flash?: { success?: string | null; error?: string | null };
    [key: string]: unknown;
}

export default function Show({ project, relatedProjects }: Props) {
    const { locale, translations: t, availableLocales, localeNames, flash } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    const lastSuccessToastRef = useRef<string | null>(null);
    const lastFlashErrorToastRef = useRef<string | null>(null);
    const lastValidationErrorToastRef = useRef<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

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
    }, [project]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/project/${project.slug}/reserve`, {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`${project.name} | ${t.brand_name} ${t.brand_tagline}`} />
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

            <div className={`grain-overlay min-h-screen bg-[#0a0a0a] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* ─── Navigation ─── */}
                <Navbar locale={locale} translations={t} availableLocales={availableLocales} localeNames={localeNames} />

                {/* ─── Hero Banner ─── */}
                <section className="animate-on-scroll relative pt-24">
                    <div className="relative w-full overflow-hidden" style={{ maxHeight: '65vh', aspectRatio: '21/9' }}>
                        <img src={project.image_url} alt={project.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/15 to-transparent" />

                        {/* Price tag */}
                        <div className="absolute right-6 bottom-8 md:right-12 md:bottom-12">
                            <div className="relative bg-[#c9a050] px-6 py-4 shadow-2xl shadow-[#c9a050]/20">
                                <div className="geo-corner geo-corner-tl absolute" />
                                <div className="geo-corner geo-corner-br absolute" />
                                <p className="text-[9px] font-bold tracking-[0.25em] text-[#0a0a0a]/50 uppercase">{t.starting_from}</p>
                                <p className="mt-1 font-serif text-2xl font-bold text-[#0a0a0a]">${project.price_starts_at}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Main Content ─── */}
                <main className="relative py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid gap-16 lg:grid-cols-5">
                            {/* Left: Project Details */}
                            <div className="space-y-12 lg:col-span-3">
                                {/* Title */}
                                <div className="animate-on-scroll">
                                    <div className={`mb-5 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="h-px w-8 bg-[#c9a050]" />
                                        <span className="text-[10px] font-bold tracking-[0.3em] text-[#c9a050] uppercase">
                                            {t[project.type] || project.type}
                                        </span>
                                    </div>
                                    <h1
                                        className="font-serif font-bold text-white"
                                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.1 }}
                                    >
                                        {project.name}
                                    </h1>
                                    {project.location && (
                                        <p className="mt-3 flex items-center gap-2 text-sm text-white/35">
                                            <svg
                                                className="h-4 w-4 text-[#c9a050]/50"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            {project.location}
                                        </p>
                                    )}
                                </div>

                                {/* Property Specs Grid */}
                                <div className="animate-on-scroll" data-delay="1">
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                        {project.location && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="geo-corner geo-corner-tl absolute" />
                                                <p className="mb-2 text-[9px] font-bold tracking-[0.22em] text-white/25 uppercase">
                                                    {t.property_location}
                                                </p>
                                                <p className="text-sm font-medium text-white">{project.location}</p>
                                            </div>
                                        )}
                                        {project.type && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="geo-corner geo-corner-tl absolute" />
                                                <p className="mb-2 text-[9px] font-bold tracking-[0.22em] text-white/25 uppercase">
                                                    {t.property_type}
                                                </p>
                                                <p className="text-sm font-medium text-white capitalize">{t[project.type] || project.type}</p>
                                            </div>
                                        )}
                                        {project.area_sqm && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="geo-corner geo-corner-tl absolute" />
                                                <p className="mb-2 text-[9px] font-bold tracking-[0.22em] text-white/25 uppercase">{t.area_size}</p>
                                                <p className="text-sm font-medium text-white">
                                                    {project.area_sqm} {t.sqm}
                                                </p>
                                            </div>
                                        )}
                                        {project.bedrooms !== null && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="geo-corner geo-corner-tl absolute" />
                                                <p className="mb-2 text-[9px] font-bold tracking-[0.22em] text-white/25 uppercase">{t.bedrooms}</p>
                                                <p className="text-sm font-medium text-white">{project.bedrooms}</p>
                                            </div>
                                        )}
                                        {project.bathrooms !== null && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="geo-corner geo-corner-tl absolute" />
                                                <p className="mb-2 text-[9px] font-bold tracking-[0.22em] text-white/25 uppercase">{t.bathrooms}</p>
                                                <p className="text-sm font-medium text-white">{project.bathrooms}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="animate-on-scroll" data-delay="2">
                                    <div className="border-t border-[#c9a050]/8 pt-10">
                                        <div className={`mb-5 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <div className="h-px w-8 bg-[#c9a050]/40" />
                                            <h2 className="text-[10px] font-bold tracking-[0.25em] text-[#c9a050] uppercase">{t.description}</h2>
                                        </div>
                                        <p className="max-w-2xl text-sm leading-[2.2] whitespace-pre-line text-white/50">{project.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Reservation Form */}
                            <div className="lg:sticky lg:top-28 lg:col-span-2 lg:self-start">
                                <div className="animate-on-scroll overflow-hidden border border-[#c9a050]/12" data-delay="1">
                                    {/* Form header */}
                                    <div className="geo-pattern-dark bg-[#c9a050] px-8 py-6">
                                        <h2 className="font-serif text-xl font-bold tracking-wide text-[#0a0a0a]">{t.inquire_now}</h2>
                                        <p className="mt-1 text-xs text-[#0a0a0a]/55">{t.inquire_desc}</p>
                                    </div>

                                    {/* Form body */}
                                    <div className="bg-[#0d0d0d] p-8">
                                        <form onSubmit={handleSubmit} className="space-y-7">
                                            <div>
                                                <label
                                                    htmlFor="reserve-name"
                                                    className="mb-3 block text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase"
                                                >
                                                    {t.full_name}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="reserve-name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                                    placeholder={t.your_name}
                                                />
                                                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="reserve-email"
                                                    className="mb-3 block text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase"
                                                >
                                                    {t.email_address}
                                                </label>
                                                <input
                                                    type="email"
                                                    id="reserve-email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                                    placeholder={t.your_email}
                                                />
                                                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="reserve-phone"
                                                    className="mb-3 block text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase"
                                                >
                                                    {t.phone_number}
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="reserve-phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a050]'}`}
                                                    placeholder={t.phone_number}
                                                />
                                                {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="btn-gold mt-2 w-full cursor-pointer px-6 py-4 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processing ? `${t.sending}...` : t.submit_inquiry}
                                            </button>
                                        </form>

                                        <div className="mt-7 border-t border-white/5 pt-6">
                                            <p className="text-[11px] leading-relaxed text-white/18">{t.privacy_note}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Related Properties ─── */}
                        {relatedProjects && relatedProjects.length > 0 && (
                            <div className="mt-28">
                                <div className="animate-on-scroll mb-12 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-[#c9a050]/15 to-transparent" />
                                    <h2 className="font-serif text-2xl font-bold text-white">{t.related_properties}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-l from-[#c9a050]/15 to-transparent" />
                                </div>

                                <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
                                    {relatedProjects.map((related, i) => (
                                        <Link
                                            key={related.id}
                                            href={`/project/${related.slug}`}
                                            className="animate-on-scroll group min-w-[260px] cursor-pointer overflow-hidden border border-[#c9a050]/8 bg-[#0d0d0d] transition-all duration-300 hover:border-[#c9a050]/30 md:min-w-0"
                                            data-delay={i}
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.name}
                                                    className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="mb-1 font-serif font-semibold text-white transition-colors duration-150 group-hover:text-[#c9a050]">
                                                    {related.name}
                                                </h3>
                                                <p className="text-sm text-[#c9a050]/60">
                                                    {t.from} ${related.price_starts_at}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back link */}
                        <div className="mt-16 text-center">
                            <Link
                                href="/"
                                className="group inline-flex cursor-pointer items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/30 uppercase transition-colors duration-200 hover:text-[#c9a050]"
                            >
                                <svg
                                    className={`h-3 w-3 transition-transform duration-200 group-hover:-translate-x-1 ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                {t.home}
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
