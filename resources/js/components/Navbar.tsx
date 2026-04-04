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
        <nav className="navbar-floating">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex cursor-pointer items-center gap-2">
                        <div className="font-serif text-xl font-bold tracking-widest text-[#c9a050] uppercase">{t.brand_name}</div>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden items-center gap-8 md:flex">
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
                                    className="hover-gold-underline cursor-pointer text-xs font-semibold tracking-[0.2em] text-white/80 uppercase transition-colors duration-200 hover:text-[#c9a050]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="hover-gold-underline cursor-pointer text-xs font-semibold tracking-[0.2em] text-white/50 uppercase transition-colors duration-200 hover:text-[#c9a050]"
                                >
                                    {item.label}
                                </a>
                            ),
                        )}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label={t.theme_toggle_label}
                            title={t.theme_toggle_label}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#c9a050]/20 text-white/50 transition-all duration-200 hover:border-[#c9a050]/60 hover:text-[#c9a050] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a050]/50"
                        >
                            {theme === 'dark' ? (
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Locale Switcher */}
                        <div className="flex items-center overflow-hidden rounded-full border border-[#c9a050]/20">
                            {availableLocales.map((loc) => (
                                <Link
                                    key={loc}
                                    href={`/locale/${loc}`}
                                    className={`cursor-pointer px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 ${
                                        locale === loc ? 'bg-[#c9a050] text-[#0a0a0a]' : 'text-white/40 hover:text-white/80'
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
