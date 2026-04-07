# Deduplicate Locale Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract locale validation into a single `isValidLocale()` method on `LocaleService` that both middleware and service consume.

**Architecture:** Add a static method to the existing `LocaleService` class. The middleware imports and calls this method instead of inline `in_array()`. The service's `setLocale()` method calls `self::isValidLocale()` instead of its own inline check. Behavior is preserved: middleware silently falls back, service throws.

**Tech Stack:** PHP 8.2, Laravel 12, PHPUnit

**Spec:** `docs/superpowers/specs/2026-04-07-deduplicate-locale-validation-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/Services/LocaleService.php` | Modify | Add `isValidLocale()` static method, refactor `setLocale()` to use it |
| `app/Http/Middleware/SetLocale.php` | Modify | Import `LocaleService`, replace inline `in_array` with `LocaleService::isValidLocale()` |
| `tests/Unit/Services/LocaleServiceTest.php` | Modify | Add 4 tests for `isValidLocale()` |

---

## Task 1: Add isValidLocale() tests to LocaleServiceTest

**Files:**
- Modify: `tests/Unit/Services/LocaleServiceTest.php`

- [ ] **Step 1: Write the failing tests for isValidLocale()**

Add these 4 test methods to the end of `LocaleServiceTest` class:

```php
public function test_is_valid_locale_returns_true_for_english(): void
{
    Config::set('app.available_locales', ['en', 'ar']);

    $this->assertTrue(LocaleService::isValidLocale('en'));
}

public function test_is_valid_locale_returns_true_for_arabic(): void
{
    Config::set('app.available_locales', ['en', 'ar']);

    $this->assertTrue(LocaleService::isValidLocale('ar'));
}

public function test_is_valid_locale_returns_false_for_invalid_locale(): void
{
    Config::set('app.available_locales', ['en', 'ar']);

    $this->assertFalse(LocaleService::isValidLocale('fr'));
}

public function test_is_valid_locale_returns_false_for_empty_string(): void
{
    Config::set('app.available_locales', ['en', 'ar']);

    $this->assertFalse(LocaleService::isValidLocale(''));
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test --filter LocaleServiceTest`

Expected: 4 FAIL with "Call to undefined method App\Services\LocaleService::isValidLocale()"

---

## Task 2: Implement isValidLocale() in LocaleService

**Files:**
- Modify: `app/Services/LocaleService.php:10` (add method before `setLocale`)

- [ ] **Step 1: Add the isValidLocale() static method**

Add this method to `LocaleService` class, before the `setLocale()` method:

```php
/**
 * Check if a locale is valid (exists in available_locales config).
 */
public static function isValidLocale(string $locale): bool
{
    return in_array($locale, config('app.available_locales', ['en']), true);
}
```

- [ ] **Step 2: Run new tests to verify they pass**

Run: `php artisan test --filter LocaleServiceTest`

Expected: All 6 tests PASS (4 new + 2 existing)

- [ ] **Step 3: Commit**

```bash
git add app/Services/LocaleService.php tests/Unit/Services/LocaleServiceTest.php
git commit -m "feat(locale): add isValidLocale() static method with tests"
```

---

## Task 3: Refactor LocaleService::setLocale() to use isValidLocale()

**Files:**
- Modify: `app/Services/LocaleService.php:18-23` (the setLocale method)

- [ ] **Step 1: Replace inline in_array with self::isValidLocale()**

Change the `setLocale()` method from:

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

To:

```php
public function setLocale(string $locale): void
{
    if (! self::isValidLocale($locale)) {
        throw new InvalidLocaleException;
    }

    Session::put('locale', $locale);
    App::setLocale($locale);
}
```

- [ ] **Step 2: Run all LocaleService tests to verify behavior preserved**

Run: `php artisan test --filter LocaleServiceTest`

Expected: All 6 tests PASS

- [ ] **Step 3: Commit**

```bash
git add app/Services/LocaleService.php
git commit -m "refactor(locale): use isValidLocale() in setLocale()"
```

---

## Task 4: Update SetLocale middleware to use LocaleService::isValidLocale()

**Files:**
- Modify: `app/Http/Middleware/SetLocale.php`

- [ ] **Step 1: Add LocaleService import**

Add this import after the existing use statements (after line 8):

```php
use App\Services\LocaleService;
```

- [ ] **Step 2: Replace inline in_array with LocaleService::isValidLocale()**

Change line 22 from:

```php
if (in_array($locale, config('app.available_locales', ['en']))) {
```

To:

```php
if (LocaleService::isValidLocale($locale)) {
```

- [ ] **Step 3: Run all tests to verify nothing broke**

Run: `php artisan test`

Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add app/Http/Middleware/SetLocale.php
git commit -m "refactor(locale): middleware uses LocaleService::isValidLocale()"
```

---

## Task 5: Run quality checks and final verification

**Files:** None (verification only)

- [ ] **Step 1: Run PHP formatting**

Run: `vendor/bin/pint`

Expected: No changes needed (or auto-fixed)

- [ ] **Step 2: Run full test suite**

Run: `php artisan test`

Expected: All tests PASS

- [ ] **Step 3: Manual smoke test**

1. Start dev server: `composer dev`
2. Visit http://localhost:8000
3. Click Arabic locale switcher — page should switch to Arabic
4. Click English locale switcher — page should switch to English
5. Both should work without errors

- [ ] **Step 4: Commit any formatting fixes (if needed)**

```bash
git add -A
git commit -m "style: apply pint formatting" --allow-empty
```

---

## Verification Checklist

After completing all tasks, verify acceptance criteria from spec:

- [ ] `LocaleService::isValidLocale('en')` returns `true`
- [ ] `LocaleService::isValidLocale('ar')` returns `true`
- [ ] `LocaleService::isValidLocale('fr')` returns `false`
- [ ] `LocaleService::isValidLocale('')` returns `false`
- [ ] `SetLocale` middleware uses `LocaleService::isValidLocale()`
- [ ] `LocaleService::setLocale()` uses `self::isValidLocale()`
- [ ] All existing tests pass
- [ ] New unit tests pass
