import { useTheme } from '@/hooks/useTheme';
import { Link } from '@inertiajs/react';

interface NavbarProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
}

export function Navbar({ locale, translations: t, availableLocales, localeNames }: NavbarProps) {
    const { theme, toggleTheme } = useTheme();

    return (
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
                        <button
                            onClick={toggleTheme}
                            aria-label={t.theme_toggle_label}
                            title={t.theme_toggle_label}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a050]/20 text-white/60 transition-all duration-300 hover:border-[#c9a050]/50 hover:text-[#c9a050]"
                        >
                            {theme === 'dark' ? (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                    />
                                </svg>
                            )}
                        </button>

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
    );
}
