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
                        background: '#1a1a1a',
                        color: '#ffffff',
                        border: '1px solid #c9a050',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                    },
                    success: {
                        iconTheme: {
                            primary: '#c9a050',
                            secondary: '#1a1a1a',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />

            <div className={`grain-overlay min-h-screen bg-[#080808] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Language Switcher */}
                <div className="fixed top-6 right-6 z-50">
                    <div className="flex overflow-hidden rounded-full border border-[#c9a050]/20 bg-[#080808]/80 backdrop-blur-xl">
                        {availableLocales.map((loc) => (
                            <Link
                                key={loc}
                                href={`/locale/${loc}`}
                                className={`px-4 py-2 text-xs font-medium tracking-wider transition-all duration-300 ${
                                    locale === loc ? 'bg-[#c9a050] font-semibold text-[#080808]' : 'text-white/50 hover:text-white'
                                }`}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ─── Navigation ─── */}
                <nav className="border-b border-[#c9a050]/10 bg-[#080808]">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="flex h-20 items-center justify-between">
                            <Link
                                href="/"
                                className="font-serif text-2xl font-bold tracking-wide text-[#c9a050] transition-colors hover:text-[#e8c254]"
                            >
                                {t.brand_name}
                            </Link>
                            <Link
                                href="/"
                                className="group flex items-center gap-2 text-xs font-medium tracking-widest text-white/40 uppercase transition-colors hover:text-[#c9a050]"
                            >
                                <svg
                                    className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                </svg>
                                {t.back_to_properties}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* ─── Hero Image ─── */}
                <section className="animate-on-scroll relative">
                    <div className="relative aspect-[21/9] max-h-[60vh] w-full overflow-hidden">
                        <img src={project.image_url} alt={project.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent"></div>
                        {/* Floating price tag */}
                        <div className="absolute right-6 bottom-8 md:right-12 md:bottom-12">
                            <div className="rounded-sm bg-[#c9a050] px-6 py-3 shadow-lg shadow-[#c9a050]/20">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-[#080808]/50 uppercase">{t.starting_from}</p>
                                <p className="font-serif text-2xl font-bold text-[#080808]">${project.price_starts_at}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Main Content ─── */}
                <main className="relative py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid gap-16 lg:grid-cols-5">
                            {/* Left Column: Project Details */}
                            <div className="space-y-10 lg:col-span-3">
                                {/* Project Title */}
                                <div className="animate-on-scroll">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="h-px w-10 bg-[#c9a050]"></div>
                                        <span className="text-[10px] font-semibold tracking-[0.3em] text-[#c9a050] uppercase">
                                            {t[project.type] || project.type}
                                        </span>
                                    </div>
                                    <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">{project.name}</h1>
                                    {project.location && <p className="mt-3 text-sm text-white/30">{project.location}</p>}
                                </div>

                                {/* Property Details Grid */}
                                <div className="animate-on-scroll" data-delay="1">
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {project.location && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#c9a050]/30"></div>
                                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                                                    {t.property_location}
                                                </p>
                                                <p className="text-sm font-medium text-white">{project.location}</p>
                                            </div>
                                        )}
                                        {project.type && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#c9a050]/30"></div>
                                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                                                    {t.property_type}
                                                </p>
                                                <p className="text-sm font-medium text-white capitalize">{t[project.type] || project.type}</p>
                                            </div>
                                        )}
                                        {project.area_sqm && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#c9a050]/30"></div>
                                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{t.area_size}</p>
                                                <p className="text-sm font-medium text-white">
                                                    {project.area_sqm} {t.sqm}
                                                </p>
                                            </div>
                                        )}
                                        {project.bedrooms !== null && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#c9a050]/30"></div>
                                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{t.bedrooms}</p>
                                                <p className="text-sm font-medium text-white">{project.bedrooms}</p>
                                            </div>
                                        )}
                                        {project.bathrooms !== null && (
                                            <div className="relative border border-[#c9a050]/10 bg-[#0d0d0d] p-5">
                                                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#c9a050]/30"></div>
                                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{t.bathrooms}</p>
                                                <p className="text-sm font-medium text-white">{project.bathrooms}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="animate-on-scroll" data-delay="2">
                                    <div className="border-t border-[#c9a050]/10 pt-10">
                                        <div className="mb-6 flex items-center gap-3">
                                            <div className="h-px w-10 bg-[#c9a050]/40"></div>
                                            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#c9a050] uppercase">{t.description}</h2>
                                        </div>
                                        <p className="max-w-2xl font-serif text-base leading-[2.2] whitespace-pre-line text-white/60">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Registration Form */}
                            <div className="lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
                                <div className="animate-on-scroll overflow-hidden border border-[#c9a050]/10" data-delay="1">
                                    {/* Gold header band */}
                                    <div className="geo-pattern-dark bg-[#c9a050] px-8 py-6">
                                        <h2 className="font-serif text-xl font-bold text-[#080808]">{t.inquire_now}</h2>
                                        <p className="mt-1 text-xs text-[#080808]/60">{t.inquire_desc}</p>
                                    </div>

                                    {/* Form body */}
                                    <div className="bg-[#0d0d0d] p-8">
                                        <form onSubmit={handleSubmit} className="space-y-7">
                                            {/* Name Field */}
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="mb-3 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                                >
                                                    {t.full_name}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors focus:outline-none ${
                                                        errors.name
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                    }`}
                                                    placeholder={t.your_name}
                                                />
                                                {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                                >
                                                    {t.email_address}
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors focus:outline-none ${
                                                        errors.email
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                    }`}
                                                    placeholder={t.your_email}
                                                />
                                                {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                                            </div>

                                            {/* Phone Field */}
                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className="mb-3 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                                                >
                                                    {t.phone_number}
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className={`block w-full border-b bg-transparent px-0 py-3 text-sm text-white transition-colors focus:outline-none ${
                                                        errors.phone
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                    }`}
                                                    placeholder={t.phone_number}
                                                />
                                                {errors.phone && <p className="mt-2 text-xs text-red-500">{errors.phone}</p>}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="btn-gold mt-4 w-full cursor-pointer rounded-sm px-6 py-4 text-sm font-bold tracking-wider text-white uppercase disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processing ? t.sending + '...' : t.submit_inquiry}
                                            </button>
                                        </form>

                                        {/* Privacy Note */}
                                        <div className="mt-8 border-t border-white/5 pt-6">
                                            <p className="text-[11px] leading-relaxed text-white/20">{t.privacy_note}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Related Properties ─── */}
                        {relatedProjects && relatedProjects.length > 0 && (
                            <div className="mt-24">
                                <div className="animate-on-scroll mb-10 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-[#c9a050]/20 to-transparent"></div>
                                    <h2 className="font-serif text-2xl font-bold text-white">{t.related_properties}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-l from-[#c9a050]/20 to-transparent"></div>
                                </div>

                                {/* Horizontal scroll on mobile, grid on desktop */}
                                <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
                                    {relatedProjects.map((related, i) => (
                                        <Link
                                            key={related.id}
                                            href={`/project/${related.slug}`}
                                            className="animate-on-scroll group min-w-[260px] overflow-hidden border border-[#c9a050]/10 bg-[#0d0d0d] transition-all duration-500 hover:border-[#c9a050]/30 md:min-w-0"
                                            data-delay={i}
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="mb-1 font-serif font-medium text-white transition-colors group-hover:text-[#c9a050]">
                                                    {related.name}
                                                </h3>
                                                <p className="text-sm text-[#c9a050]/70">
                                                    {t.from} ${related.price_starts_at}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
