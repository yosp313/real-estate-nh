# Arabic Localization - NH Real Estate

## Overview
This project now supports both English and Arabic languages with full RTL (Right-to-Left) support.

## Features Implemented

### 1. **Backend Localization**
- **Language Files**: Created translation files in `lang/en/messages.php` and `lang/ar/messages.php`
- **Middleware**: `SetLocale` middleware automatically sets the language based on session
- **Controller**: `LocaleController` handles language switching
- **Configuration**: Updated `config/app.php` with available locales

### 2. **Frontend Integration**
- **Inertia Props**: Translations, locale, and available locales are shared with all pages
- **React Components**: Both `Index.tsx` and `Show.tsx` updated to use translations
- **Language Switcher**: Fixed position switcher in top-right corner on all pages

### 3. **RTL Support**
- **Direction Attribute**: Automatically applied based on selected language
- **CSS**: Custom RTL styles for proper text alignment and layout
- **Arabic Font**: Cairo font loaded for optimal Arabic text rendering

## How to Use

### Switching Languages
1. Click on the language switcher (top-right corner)
2. Select "English" or "العربية" (Arabic)
3. The page will reload with the selected language

### Language Persistence
- Selected language is stored in the session
- Language preference persists across page navigation
- Refreshing the page maintains the selected language

## Technical Details

### Routes
```php
GET /locale/{locale} - Switch language (locale: en or ar)
```

### Available Locales
- `en` - English
- `ar` - Arabic (العربية)

### Translation Keys
All translations are stored in `lang/{locale}/messages.php` files with keys like:
- `brand_name`, `brand_tagline`
- `about_nh`, `about_description`
- `our_services`, `property_sales`, etc.
- `inquire_now`, `submit_inquiry`
- And more...

### Adding New Translations
1. Add the translation key to both `lang/en/messages.php` and `lang/ar/messages.php`
2. Use in React components: `const { translations: t } = usePage().props`
3. Access translation: `{t.your_key}`

### RTL Layout Features
- Automatic text direction change
- Flipped navigation elements (arrows, positioning)
- Arabic-optimized font (Cairo)
- Proper text rendering and smoothing

## Browser Support
Works on all modern browsers with proper RTL and Arabic font support.

## Testing
1. Visit the homepage: `/`
2. Click the language switcher (top-right)
3. Test all pages:
   - Homepage gallery
   - Property detail pages
   - Inquiry forms
4. Verify RTL layout in Arabic mode
5. Test form submissions in both languages
