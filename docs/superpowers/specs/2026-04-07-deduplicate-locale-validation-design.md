# Design: Deduplicate Locale Validation

**Date:** 2026-04-07  
**Status:** Approved  
**Ideation Reference:** docs/ideation/code-cleanliness-and-best-practices.md (#8)

---

## Problem

Two places validate locales with different code and different failure behaviors:

| Location | Code | On Invalid Locale |
|----------|------|-------------------|
| `SetLocale` middleware | `in_array($locale, config('app.available_locales', ['en']))` | Silent fallback to default |
| `LocaleService::setLocale()` | `in_array($locale, $availableLocales, true)` | Throws `InvalidLocaleException` |

**Risk:** If someone changes the config key or validation logic in one place but not the other, they'll drift silently. Adding a new locale (e.g., French) requires verifying both locations.

---

## Solution

Add a static `isValidLocale(string $locale): bool` method to `LocaleService`. Both the middleware and the service's `setLocale()` method call this shared validator.

**Chosen approach:** Static method on existing service (vs. new value object or global helper).

**Behavior preserved:**
- Middleware: silent fallback to default locale
- Service: throws `InvalidLocaleException`

---

## Architecture

### Files Changed

1. `app/Services/LocaleService.php` — add `isValidLocale()` static method, refactor `setLocale()` to use it
2. `app/Http/Middleware/SetLocale.php` — import and call `LocaleService::isValidLocale()`

**No new files created.**

### Data Flow

```
Session::get('locale') 
    → SetLocale middleware 
    → LocaleService::isValidLocale($locale)
    → config('app.available_locales')
    → if valid: App::setLocale($locale)
    → if invalid: use default (no change)

User clicks locale switcher
    → LocaleController::setLocale($locale)
    → LocaleService::setLocale($locale)
    → LocaleService::isValidLocale($locale)
    → if valid: Session::put() + App::setLocale()
    → if invalid: throw InvalidLocaleException
```

---

## Implementation Details

### LocaleService.php

**Before:**
```php
public function setLocale(string $locale): void
{
    $availableLocales = config('app.available_locales', ['en']);

    if (! in_array($locale, $availableLocales, true)) {
        throw new InvalidLocaleException;
    }

    Session::put('locale', $locale);
    App::setLocale($locale);
}
```

**After:**
```php
/**
 * Check if a locale is valid (exists in available_locales config).
 */
public static function isValidLocale(string $locale): bool
{
    return in_array($locale, config('app.available_locales', ['en']), true);
}

public function setLocale(string $locale): void
{
    if (! self::isValidLocale($locale)) {
        throw new InvalidLocaleException;
    }

    Session::put('locale', $locale);
    App::setLocale($locale);
}
```

### SetLocale.php

**Before:**
```php
use Illuminate\Support\Facades\App;
// ...

public function handle(Request $request, Closure $next): Response
{
    $locale = Session::get('locale', config('app.locale'));

    if (in_array($locale, config('app.available_locales', ['en']))) {
        App::setLocale($locale);
    }

    return $next($request);
}
```

**After:**
```php
use App\Services\LocaleService;
use Illuminate\Support\Facades\App;
// ...

public function handle(Request $request, Closure $next): Response
{
    $locale = Session::get('locale', config('app.locale'));

    if (LocaleService::isValidLocale($locale)) {
        App::setLocale($locale);
    }

    return $next($request);
}
```

---

## Error Handling

| Caller | On Invalid Locale | Rationale |
|--------|-------------------|-----------|
| `SetLocale` middleware | Silent fallback | Session may contain stale/invalid locale from old config. Don't break page load. |
| `LocaleService::setLocale()` | Throw `InvalidLocaleException` | Explicit user action (clicking switcher). Invalid locale is a bug or attack. |
| `isValidLocale()` | Returns `false` | Pure boolean, no side effects. Caller decides how to handle. |

---

## Testing

### New Tests for LocaleServiceTest

```php
public function test_is_valid_locale_returns_true_for_english(): void
{
    $this->assertTrue(LocaleService::isValidLocale('en'));
}

public function test_is_valid_locale_returns_true_for_arabic(): void
{
    $this->assertTrue(LocaleService::isValidLocale('ar'));
}

public function test_is_valid_locale_returns_false_for_invalid_locale(): void
{
    $this->assertFalse(LocaleService::isValidLocale('invalid'));
}

public function test_is_valid_locale_returns_false_for_empty_string(): void
{
    $this->assertFalse(LocaleService::isValidLocale(''));
}
```

### Existing Tests

- `LocaleServiceTest::test_set_locale_throws_exception_for_invalid_locale` — unchanged, still passes
- `SetLocaleTest` (if exists) — unchanged, behavior preserved

---

## Acceptance Criteria

1. `LocaleService::isValidLocale('en')` returns `true`
2. `LocaleService::isValidLocale('ar')` returns `true`
3. `LocaleService::isValidLocale('fr')` returns `false` (until added to config)
4. `LocaleService::isValidLocale('')` returns `false`
5. `SetLocale` middleware uses `LocaleService::isValidLocale()` instead of inline `in_array`
6. `LocaleService::setLocale()` uses `self::isValidLocale()` instead of inline `in_array`
7. All existing tests pass
8. New unit tests for `isValidLocale()` pass

---

## Out of Scope

- Adding new locales (this design enables easier addition, but doesn't add any)
- Changing failure behavior (middleware stays silent, service stays throwing)
- Caching available locales (config() is already cached in production)
