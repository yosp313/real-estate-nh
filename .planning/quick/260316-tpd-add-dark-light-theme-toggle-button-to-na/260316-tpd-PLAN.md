---
phase: 260316-tpd
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - resources/js/hooks/useTheme.ts
  - resources/js/components/Navbar.tsx
  - resources/js/pages/Projects/Index.tsx
  - resources/js/pages/Projects/Show.tsx
  - resources/css/app.css
  - lang/en/messages.php
  - lang/ar/messages.php
autonomous: true
requirements:
  - THEME-01
must_haves:
  truths:
    - "Clicking the toggle button in the navbar switches between dark and light visual themes"
    - "The selected theme persists across page refreshes via localStorage"
    - "On first visit with no saved preference, the theme matches the OS prefers-color-scheme"
    - "The toggle button renders correctly in both LTR (EN) and RTL (AR) navbar layouts"
    - "Toggle label/icon uses the translations system, not hardcoded strings"
  artifacts:
    - path: "resources/js/hooks/useTheme.ts"
      provides: "Theme state management — reads/writes localStorage, respects prefers-color-scheme"
      exports: ["useTheme"]
    - path: "resources/js/components/Navbar.tsx"
      provides: "Shared navbar component with theme toggle button"
      exports: ["Navbar"]
    - path: "resources/css/app.css"
      provides: "Light theme CSS variable overrides via [data-theme='light'] selector"
      contains: "[data-theme='light']"
  key_links:
    - from: "resources/js/hooks/useTheme.ts"
      to: "document.documentElement"
      via: "setAttribute('data-theme', theme)"
      pattern: "setAttribute.*data-theme"
    - from: "resources/js/components/Navbar.tsx"
      to: "resources/js/hooks/useTheme.ts"
      via: "useTheme() hook"
      pattern: "useTheme"
    - from: "resources/js/pages/Projects/Index.tsx"
      to: "resources/js/components/Navbar.tsx"
      via: "import Navbar"
      pattern: "import.*Navbar"
---

<objective>
Add a dark/light theme toggle button to the navbar. The toggle persists the user's choice to localStorage and defaults to the OS `prefers-color-scheme` on first visit. Works identically in EN (LTR) and AR (RTL) layouts.

Purpose: First active requirement from the current phase. Improves user experience for visitors who prefer a light reading environment.
Output: `useTheme` hook, shared `Navbar` component, light-theme CSS overrides, translation keys in EN + AR.
</objective>

<execution_context>
@/mnt/Dev/Projects/php/real-estate-nh/.claude/get-shit-done/workflows/execute-plan.md
@/mnt/Dev/Projects/php/real-estate-nh/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/mnt/Dev/Projects/php/real-estate-nh/.planning/PROJECT.md
@/mnt/Dev/Projects/php/real-estate-nh/.planning/STATE.md

<!-- Key interfaces the executor needs. Extracted from codebase. -->
<interfaces>
<!-- From resources/js/pages/Projects/Index.tsx and Show.tsx — shared props pattern -->
```typescript
interface SharedProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
    flash?: { success?: string | null; error?: string | null };
    [key: string]: unknown;
}
// Usage in pages:
const { locale, translations: t, availableLocales, localeNames } = usePage<SharedProps>().props;
const isRTL = locale === 'ar';
```

<!-- Navbar markup (current — from Index.tsx lines 185-236) -->
```tsx
<nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#c9a050]/10 bg-[#080808]/90 backdrop-blur-xl">
  <div className="mx-auto max-w-7xl px-6 lg:px-10">
    <div className="flex h-20 items-center justify-between">
      {/* Brand logo left */}
      <Link href="/" className="flex items-center gap-3">
        <div className="font-serif text-2xl font-bold tracking-wide text-[#c9a050]">{t.brand_name}</div>
      </Link>
      {/* Nav links center (hidden on mobile) */}
      <div className="hidden items-center gap-10 md:flex">
        {/* ... nav links ... */}
      </div>
      {/* Right controls — locale switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center overflow-hidden rounded-full border border-[#c9a050]/20">
          {availableLocales.map((loc) => (
            <Link key={loc} href={`/locale/${loc}`} className={...}>{localeNames[loc]}</Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</nav>
```

<!-- Tailwind v4 CSS theme tokens (from resources/css/app.css) -->
```css
/* Dark palette (current defaults) */
--color-dark-950: #080808;
--color-dark-900: #0d0d0d;
--color-dark-800: #1a1a1a;
--color-gold-500: #c9a050;
--color-sand-50:  #faf8f4;
--color-sand-100: #f7f3eb;
--color-sand-200: #ede5d4;
```
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Add useTheme hook and light-theme CSS</name>
  <files>
    resources/js/hooks/useTheme.ts
    resources/css/app.css
  </files>
  <action>
**Create `resources/js/hooks/useTheme.ts`:**

Export a `useTheme()` hook that:
1. Reads initial theme from `localStorage.getItem('theme')`. If null, reads `window.matchMedia('(prefers-color-scheme: dark)').matches` — true → `'dark'`, false → `'light'`.
2. Stores `theme: 'dark' | 'light'` in React state.
3. On theme change (and on mount), sets `document.documentElement.setAttribute('data-theme', theme)`.
4. Exposes `toggleTheme: () => void` which flips state and writes new value to `localStorage.setItem('theme', newTheme)`.
5. Returns `{ theme, toggleTheme }`.

TypeScript strict — no `any`. Return type: `{ theme: 'dark' | 'light'; toggleTheme: () => void }`.

**Add light-theme CSS to `resources/css/app.css` (append after existing rules):**

Use a `[data-theme='light']` selector on `:root` or `html` to override the dark-by-default site colors. The site uses hardcoded hex values in Tailwind classes (e.g., `bg-[#080808]`, `text-white`), so CSS variables alone won't recolor inline Tailwind utilities. Instead, add CSS variable overrides plus targeted element overrides for the light theme:

```css
/* ───────────────────────────────────────────────
   Light Theme Overrides
   ─────────────────────────────────────────────── */
[data-theme='light'] {
    /* Background system */
    --theme-bg-primary: #faf8f4;
    --theme-bg-secondary: #f7f3eb;
    --theme-bg-card: #ffffff;
    --theme-bg-nav: rgba(250, 248, 244, 0.92);

    /* Text system */
    --theme-text-primary: #1a1a1a;
    --theme-text-secondary: #4d4d4d;
    --theme-text-muted: rgba(26, 26, 26, 0.6);

    /* Border system */
    --theme-border: rgba(201, 160, 80, 0.25);
}

/* Apply to site wrapper */
[data-theme='light'] .grain-overlay {
    background-color: var(--theme-bg-primary) !important;
}

[data-theme='light'] nav {
    background-color: var(--theme-bg-nav) !important;
    border-color: var(--theme-border) !important;
}

[data-theme='light'] nav a,
[data-theme='light'] nav span {
    color: var(--theme-text-primary) !important;
}

[data-theme='light'] nav a:hover {
    color: #c9a050 !important;
}
```

This gives a usable light theme. Executor note: light theme doesn't need pixel-perfect coverage of every section — nav + main bg + text legibility is the acceptance bar.
  </action>
  <verify>
    <automated>npm run types 2>&1 | grep -E "error|Error" || echo "types OK"</automated>
  </verify>
  <done>
    - `resources/js/hooks/useTheme.ts` exists and exports `useTheme`
    - TypeScript check passes (no errors in new file)
    - `[data-theme='light']` rules exist in `app.css`
    - Setting `document.documentElement.setAttribute('data-theme', 'light')` in browser DevTools visually changes background from `#080808` to sand/cream
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add translation keys for theme toggle</name>
  <files>
    lang/en/messages.php
    lang/ar/messages.php
  </files>
  <action>
Add the following translation keys to both files.

**`lang/en/messages.php`** — add to the `// Common` section:
```php
'theme_toggle_dark'  => 'Dark',
'theme_toggle_light' => 'Light',
'theme_toggle_label' => 'Toggle theme',
```

**`lang/ar/messages.php`** — add to the `// Common` section:
```php
'theme_toggle_dark'  => 'داكن',
'theme_toggle_light' => 'فاتح',
'theme_toggle_label' => 'تبديل المظهر',
```
  </action>
  <verify>
    <automated>php -r "require 'lang/en/messages.php'; echo array_key_exists('theme_toggle_label', \$arr = require('lang/en/messages.php')) ? 'OK' : 'MISSING';" 2>/dev/null || php -r "\$a = include '/mnt/Dev/Projects/php/real-estate-nh/lang/en/messages.php'; echo isset(\$a['theme_toggle_label']) ? 'OK' : 'MISSING';"</automated>
  </verify>
  <done>
    - `lang/en/messages.php` contains `theme_toggle_dark`, `theme_toggle_light`, `theme_toggle_label`
    - `lang/ar/messages.php` contains matching keys with Arabic translations
    - `composer test` (which clears config cache) passes without errors
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Extract shared Navbar component with theme toggle, update pages</name>
  <files>
    resources/js/components/Navbar.tsx
    resources/js/pages/Projects/Index.tsx
    resources/js/pages/Projects/Show.tsx
  </files>
  <action>
**Create `resources/js/components/Navbar.tsx`:**

This replaces the duplicated `<nav>` block currently copy-pasted in both pages. Props:

```typescript
interface NavbarProps {
    locale: string;
    translations: Record<string, string>;
    availableLocales: string[];
    localeNames: Record<string, string>;
}
```

The component:
1. Imports `useTheme` from `@/hooks/useTheme`.
2. Renders the existing nav markup (brand, nav links, locale switcher) — copy from `Index.tsx` lines 185-236.
3. Adds the theme toggle button **inside** the `<div className="flex items-center gap-4">` block (right side, before or after the locale switcher).

Theme toggle button design — matches the "Desert Luxury Editorial" aesthetic:
```tsx
<button
  onClick={toggleTheme}
  aria-label={t.theme_toggle_label}
  title={t.theme_toggle_label}
  className="flex items-center justify-center w-9 h-9 rounded-full border border-[#c9a050]/20 text-white/60 hover:text-[#c9a050] hover:border-[#c9a050]/50 transition-all duration-300"
>
  {theme === 'dark' ? (
    /* Sun icon for switching to light */
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ) : (
    /* Moon icon for switching to dark */
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  )}
</button>
```

The `isRTL` check for `dir` attribute is NOT needed inside `Navbar.tsx` — the parent page's root `<div>` already sets `dir={isRTL ? 'rtl' : 'ltr'}`, so flex ordering inverts automatically in RTL.

**Update `resources/js/pages/Projects/Index.tsx`:**
- Remove the `<nav>...</nav>` block (lines ~185-236)
- Add `import { Navbar } from '@/components/Navbar';`
- Replace removed nav with: `<Navbar locale={locale} translations={t} availableLocales={availableLocales} localeNames={localeNames} />`

**Update `resources/js/pages/Projects/Show.tsx`:**
- Same replacement — remove the existing `<nav>` block, import and use `<Navbar>` with same props.

TypeScript strict — no `any`, use `@/*` alias.
  </action>
  <verify>
    <automated>npm run types 2>&1 | tail -5</automated>
  </verify>
  <done>
    - `resources/js/components/Navbar.tsx` exists and compiles without TypeScript errors
    - `Index.tsx` and `Show.tsx` no longer contain inline `<nav>` markup — they import `Navbar`
    - `npm run types` passes with no errors
    - `npm run lint` passes
    - `npm run format` passes
    - `composer test` passes
    - Running `npm run dev` and visiting `/` shows the toggle button in the navbar
    - Clicking the toggle switches between dark (black) and light (sand/cream) themes
    - Refreshing the page preserves the last selected theme
    - Both EN (LTR) and AR (RTL) navbar layouts render the toggle correctly
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    Dark/light theme toggle button in navbar. `useTheme` hook with localStorage persistence and system-preference default. Shared `Navbar` component extracted from both pages. Translation keys added in EN and AR.
  </what-built>
  <how-to-verify>
    1. Run `npm run dev` and open http://localhost:5173 (or your Vite port)
    2. Confirm the toggle button (sun/moon icon) appears in the top-right navbar area
    3. Click the toggle — the page background should switch between dark (#080808) and sand/cream (#faf8f4)
    4. Refresh the page — the selected theme should persist
    5. Open DevTools > Application > Local Storage — confirm a `theme` key with value `dark` or `light`
    6. Clear localStorage, then reload — theme should match your OS dark/light mode preference
    7. Switch to Arabic locale (`/locale/ar`) — confirm the toggle button still appears and functions correctly in the RTL navbar
    8. Confirm nav text is legible in both themes (no invisible-on-background text)
  </how-to-verify>
  <resume-signal>Type "approved" or describe any visual/functional issues</resume-signal>
</task>

</tasks>

<verification>
- `npm run types` — zero TypeScript errors
- `npm run lint` — zero ESLint errors
- `npm run format` — no formatting violations
- `composer test` — all PHP tests pass
- Manual: toggle persists across refresh, respects system preference on first visit, works in both locales
</verification>

<success_criteria>
- Theme toggle button visible in navbar on all pages
- Clicking toggles between dark and light visual themes (background + text)
- `localStorage.getItem('theme')` returns `'dark'` or `'light'` after first click
- On fresh visit (no localStorage), theme matches `prefers-color-scheme` media query
- AR (RTL) layout shows toggle correctly positioned and functional
- All quality checks pass: `vendor/bin/pint && npm run lint && npm run format && npm run types && composer test`
</success_criteria>

<output>
After completion, create `.planning/quick/260316-tpd-add-dark-light-theme-toggle-button-to-na/260316-tpd-SUMMARY.md`
</output>
