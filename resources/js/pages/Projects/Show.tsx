import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
    id: number;
    slug: string;
    name: string;
    description: string;
    price_starts_at: string;
    image_url: string;
}

interface Props {
    project: Project;
}

interface SharedProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
    [key: string]: any;
}

export default function Show({ project }: Props) {
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
                        background: '#ffffff',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                        fontFamily: 'system-ui, sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#2563eb',
                            secondary: '#ffffff',
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

            <div className={`min-h-screen bg-[#f8f8f8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Language Switcher */}
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-white border border-gray-200 shadow-sm">
                        {availableLocales.map((loc) => (
                            <Link
                                key={loc}
                                href={`/locale/${loc}`}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                    locale === loc
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href="/"
                                className="text-2xl font-light tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
                            >
                                {t.brand_name}
                            </Link>
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wider"
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
                                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                                    <img
                                        src={project.image_url}
                                        alt={project.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Project Info */}
                                <div className="bg-white p-8 border border-gray-200">
                                    <div className="mb-8">
                                        <h1 className="text-4xl font-light text-gray-900 mb-6">
                                            {project.name}
                                        </h1>
                                        
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-2">{t.starting_from.toUpperCase()}</p>
                                            <p className="text-2xl font-medium text-gray-900">
                                                ${project.price_starts_at.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-8">
                                        <h2 className="text-sm tracking-wider text-gray-900 mb-4 font-light">{t.description.toUpperCase()}</h2>
                                        <p className="whitespace-pre-line text-gray-600 leading-relaxed text-sm">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Registration Form */}
                            <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
                                <div className="bg-white p-8 border border-gray-200">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-light text-gray-900 mb-3">
                                            {t.inquire_now}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {t.inquire_desc}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-xs tracking-wider text-gray-700 mb-2 font-light"
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
                                                        : 'border-gray-300 focus:border-gray-900'
                                                } focus:outline-none transition-colors bg-white`}
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
                                                className="block text-xs tracking-wider text-gray-700 mb-2 font-light"
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
                                                        : 'border-gray-300 focus:border-gray-900'
                                                } focus:outline-none transition-colors bg-white`}
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
                                                className="block text-xs tracking-wider text-gray-700 mb-2 font-light"
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
                                                        : 'border-gray-300 focus:border-gray-900'
                                                } focus:outline-none transition-colors bg-white`}
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
                                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light py-3 px-6 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8 tracking-wider text-sm"
                                        >
                                            {processing ? t.sending.toUpperCase() + '...' : t.submit_inquiry.toUpperCase()}
                                        </button>
                                    </form>

                                    {/* Privacy Note */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {t.privacy_note}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
