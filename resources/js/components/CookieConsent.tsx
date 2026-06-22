import { useEffect, useState } from 'react';

export function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-[#c9a050]/20 bg-[#0a0a0a]/95 p-4 backdrop-blur-xl md:right-6 md:bottom-6 md:left-auto md:max-w-md md:rounded-lg md:border md:shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-xs leading-relaxed text-white/50">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
                    <a href="/privacy" className="text-[#c9a050] underline underline-offset-2 hover:text-[#e8c254]">
                        Privacy Policy
                    </a>
                </p>
                <button
                    onClick={accept}
                    className="shrink-0 cursor-pointer bg-[#c9a050] px-5 py-2 text-[10px] font-bold tracking-[0.15em] text-[#0a0a0a] uppercase transition-colors duration-200 hover:bg-[#d4a84a]"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
