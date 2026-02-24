import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
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
    [key: string]: unknown;
}

export default function Show({ project, relatedProjects }: Props) {
    const { locale, translations: t, availableLocales, localeNames } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    // Show error toast for duplicate email
    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email, {
                duration: 4000,
                position: 'top-center',
            });
        }
    }, [errors.email]);

    useEffect(() => {
        const projectError = (errors as Record<string, string>).project;

        if (projectError) {
            toast.error(projectError, {
                duration: 4000,
                position: 'top-center',
            });
        }
    }, [errors]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/project/${project.slug}/reserve`, {
            onSuccess: () => {
                reset();
                toast.success(t.registration_success, {
                    duration: 5000,
                    position: 'top-center',
                    icon: '🎉',
                });
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
                        fontFamily: 'system-ui, sans-serif',
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

            <div className={`min-h-screen bg-[#0d0d0d] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Language Switcher */}
                <div className="fixed top-6 right-6 z-50">
                    <div className="overflow-hidden rounded border border-[#c9a050]/30 bg-[#1a1a1a]">
                        {availableLocales.map((loc) => (
                            <Link
                                key={loc}
                                href={`/locale/${loc}`}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                    locale === loc ? 'bg-[#c9a050] font-semibold text-[#1a1a1a]' : 'text-gray-300 hover:bg-[#2d2d2d]'
                                }`}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="border-b border-[#c9a050]/20 bg-[#1a1a1a]">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-2xl font-bold text-[#c9a050] transition-colors hover:text-[#d4a84a]">
                                {t.brand_name}
                            </Link>
                            <Link href="/" className="text-sm text-gray-400 transition-colors hover:text-[#c9a050]">
                                {isRTL ? '→' : '←'} {t.back_to_properties.toUpperCase()}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="py-12">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-12 lg:grid-cols-5">
                            {/* Left Column: Project Details */}
                            <div className="space-y-8 lg:col-span-3">
                                {/* Hero Image */}
                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#1a1a1a]">
                                    <img src={project.image_url} alt={project.name} className="h-full w-full object-cover" />
                                </div>

                                {/* Project Info */}
                                <div className="rounded-lg border border-[#c9a050]/20 bg-[#1a1a1a] p-8">
                                    <div className="mb-8">
                                        <h1 className="mb-6 text-4xl font-bold text-white">{project.name}</h1>

                                        <div className="mb-6">
                                            <p className="mb-2 text-sm text-gray-400">{t.starting_from.toUpperCase()}</p>
                                            <p className="text-2xl font-bold text-[#c9a050]">${project.price_starts_at}</p>
                                        </div>

                                        {/* Property Details Grid */}
                                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                            {project.location && (
                                                <div className="rounded bg-[#2d2d2d] p-4">
                                                    <p className="mb-1 text-xs text-gray-400">{t.property_location}</p>
                                                    <p className="font-medium text-white">{project.location}</p>
                                                </div>
                                            )}
                                            {project.type && (
                                                <div className="rounded bg-[#2d2d2d] p-4">
                                                    <p className="mb-1 text-xs text-gray-400">{t.property_type}</p>
                                                    <p className="font-medium text-white capitalize">{t[project.type] || project.type}</p>
                                                </div>
                                            )}
                                            {project.area_sqm && (
                                                <div className="rounded bg-[#2d2d2d] p-4">
                                                    <p className="mb-1 text-xs text-gray-400">{t.area_size}</p>
                                                    <p className="font-medium text-white">
                                                        {project.area_sqm} {t.sqm}
                                                    </p>
                                                </div>
                                            )}
                                            {project.bedrooms !== null && (
                                                <div className="rounded bg-[#2d2d2d] p-4">
                                                    <p className="mb-1 text-xs text-gray-400">{t.bedrooms}</p>
                                                    <p className="font-medium text-white">{project.bedrooms}</p>
                                                </div>
                                            )}
                                            {project.bathrooms !== null && (
                                                <div className="rounded bg-[#2d2d2d] p-4">
                                                    <p className="mb-1 text-xs text-gray-400">{t.bathrooms}</p>
                                                    <p className="font-medium text-white">{project.bathrooms}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-[#c9a050]/20 pt-8">
                                        <h2 className="mb-4 text-sm font-medium tracking-wider text-[#c9a050]">{t.description.toUpperCase()}</h2>
                                        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-300">{project.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Registration Form */}
                            <div className="lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
                                <div className="rounded-lg border border-[#c9a050]/20 bg-[#1a1a1a] p-8">
                                    <div className="mb-8">
                                        <h2 className="mb-3 text-2xl font-bold text-white">{t.inquire_now}</h2>
                                        <p className="text-sm text-gray-400">{t.inquire_desc}</p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="name" className="mb-2 block text-xs tracking-wider text-gray-400">
                                                {t.full_name.toUpperCase()}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`block w-full border px-4 py-3 ${
                                                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } rounded bg-[#2d2d2d] text-white transition-colors focus:outline-none`}
                                                placeholder={t.your_name}
                                            />
                                            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label htmlFor="email" className="mb-2 block text-xs tracking-wider text-gray-400">
                                                {t.email_address.toUpperCase()}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`block w-full border px-4 py-3 ${
                                                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } rounded bg-[#2d2d2d] text-white transition-colors focus:outline-none`}
                                                placeholder={t.your_email}
                                            />
                                            {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label htmlFor="phone" className="mb-2 block text-xs tracking-wider text-gray-400">
                                                {t.phone_number.toUpperCase()}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`block w-full border px-4 py-3 ${
                                                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } rounded bg-[#2d2d2d] text-white transition-colors focus:outline-none`}
                                                placeholder={t.phone_number}
                                            />
                                            {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-8 w-full rounded bg-[#c9a050] px-6 py-3 text-sm font-semibold tracking-wider text-[#1a1a1a] transition-colors duration-200 hover:bg-[#b8923a] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing ? t.sending.toUpperCase() + '...' : t.submit_inquiry.toUpperCase()}
                                        </button>
                                    </form>

                                    {/* Privacy Note */}
                                    <div className="mt-8 border-t border-[#c9a050]/20 pt-6">
                                        <p className="text-xs leading-relaxed text-gray-500">{t.privacy_note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Projects */}
                        {relatedProjects && relatedProjects.length > 0 && (
                            <div className="mt-16">
                                <h2 className="mb-8 text-2xl font-bold text-white">{t.related_properties}</h2>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {relatedProjects.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/project/${related.slug}`}
                                            className="group overflow-hidden rounded-lg border border-[#c9a050]/20 bg-[#1a1a1a] transition-all hover:border-[#c9a050]/50"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="mb-1 font-medium text-white transition-colors group-hover:text-[#c9a050]">
                                                    {related.name}
                                                </h3>
                                                <p className="text-sm text-[#c9a050]">
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
