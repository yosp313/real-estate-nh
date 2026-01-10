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
    [key: string]: any;
}

export default function Show({ project, relatedProjects }: Props) {
    const { locale, translations: t, availableLocales, localeNames } = usePage<SharedProps>().props;
    const isRTL = locale === 'ar';
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
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
                    <div className="bg-[#1a1a1a] border border-[#c9a050]/30 rounded overflow-hidden">
                        {availableLocales.map((loc) => (
                            <Link
                                key={loc}
                                href={`/locale/${loc}`}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                    locale === loc
                                        ? 'bg-[#c9a050] text-[#1a1a1a] font-semibold'
                                        : 'text-gray-300 hover:bg-[#2d2d2d]'
                                }`}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="bg-[#1a1a1a] border-b border-[#c9a050]/20">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-[#c9a050] hover:text-[#d4a84a] transition-colors"
                            >
                                {t.brand_name}
                            </Link>
                            <Link
                                href="/"
                                className="text-sm text-gray-400 hover:text-[#c9a050] transition-colors"
                            >
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
                            <div className="lg:col-span-3 space-y-8">
                                {/* Hero Image */}
                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#1a1a1a]">
                                    <img
                                        src={project.image_url}
                                        alt={project.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Project Info */}
                                <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#c9a050]/20">
                                    <div className="mb-8">
                                        <h1 className="text-4xl font-bold text-white mb-6">
                                            {project.name}
                                        </h1>
                                        
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-400 mb-2">{t.starting_from.toUpperCase()}</p>
                                            <p className="text-2xl font-bold text-[#c9a050]">
                                                ${project.price_starts_at}
                                            </p>
                                        </div>
                                        
                                        {/* Property Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            {project.location && (
                                                <div className="bg-[#2d2d2d] p-4 rounded">
                                                    <p className="text-xs text-gray-400 mb-1">{t.property_location}</p>
                                                    <p className="text-white font-medium">{project.location}</p>
                                                </div>
                                            )}
                                            {project.type && (
                                                <div className="bg-[#2d2d2d] p-4 rounded">
                                                    <p className="text-xs text-gray-400 mb-1">{t.property_type}</p>
                                                    <p className="text-white font-medium capitalize">{t[project.type] || project.type}</p>
                                                </div>
                                            )}
                                            {project.area_sqm && (
                                                <div className="bg-[#2d2d2d] p-4 rounded">
                                                    <p className="text-xs text-gray-400 mb-1">{t.area_size}</p>
                                                    <p className="text-white font-medium">{project.area_sqm} {t.sqm}</p>
                                                </div>
                                            )}
                                            {project.bedrooms !== null && (
                                                <div className="bg-[#2d2d2d] p-4 rounded">
                                                    <p className="text-xs text-gray-400 mb-1">{t.bedrooms}</p>
                                                    <p className="text-white font-medium">{project.bedrooms}</p>
                                                </div>
                                            )}
                                            {project.bathrooms !== null && (
                                                <div className="bg-[#2d2d2d] p-4 rounded">
                                                    <p className="text-xs text-gray-400 mb-1">{t.bathrooms}</p>
                                                    <p className="text-white font-medium">{project.bathrooms}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-[#c9a050]/20 pt-8">
                                        <h2 className="text-sm tracking-wider text-[#c9a050] mb-4 font-medium">{t.description.toUpperCase()}</h2>
                                        <p className="whitespace-pre-line text-gray-300 leading-relaxed text-sm">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Registration Form */}
                            <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
                                <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#c9a050]/20">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-white mb-3">
                                            {t.inquire_now}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {t.inquire_desc}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-xs tracking-wider text-gray-400 mb-2"
                                            >
                                                {t.full_name.toUpperCase()}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`block w-full px-4 py-3 border ${
                                                    errors.name
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } focus:outline-none transition-colors bg-[#2d2d2d] text-white rounded`}
                                                placeholder={t.your_name}
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-xs text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-xs tracking-wider text-gray-400 mb-2"
                                            >
                                                {t.email_address.toUpperCase()}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`block w-full px-4 py-3 border ${
                                                    errors.email
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } focus:outline-none transition-colors bg-[#2d2d2d] text-white rounded`}
                                                placeholder={t.your_email}
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-xs text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-xs tracking-wider text-gray-400 mb-2"
                                            >
                                                {t.phone_number.toUpperCase()}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`block w-full px-4 py-3 border ${
                                                    errors.phone
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-[#3d3d3d] focus:border-[#c9a050]'
                                                } focus:outline-none transition-colors bg-[#2d2d2d] text-white rounded`}
                                                placeholder={t.phone_number}
                                            />
                                            {errors.phone && (
                                                <p className="mt-2 text-xs text-red-600">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-[#c9a050] hover:bg-[#b8923a] text-[#1a1a1a] font-semibold py-3 px-6 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8 tracking-wider text-sm"
                                        >
                                            {processing ? t.sending.toUpperCase() + '...' : t.submit_inquiry.toUpperCase()}
                                        </button>
                                    </form>

                                    {/* Privacy Note */}
                                    <div className="mt-8 pt-6 border-t border-[#c9a050]/20">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {t.privacy_note}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Related Projects */}
                        {relatedProjects && relatedProjects.length > 0 && (
                            <div className="mt-16">
                                <h2 className="text-2xl font-bold text-white mb-8">{t.related_properties}</h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedProjects.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/project/${related.slug}`}
                                            className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#c9a050]/20 hover:border-[#c9a050]/50 transition-all"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-white font-medium mb-1 group-hover:text-[#c9a050] transition-colors">
                                                    {related.name}
                                                </h3>
                                                <p className="text-[#c9a050] text-sm">
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
