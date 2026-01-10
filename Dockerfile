# =============================================================================
# Multi-stage Dockerfile for Laravel + Inertia + React Application
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base PHP image with extensions
# -----------------------------------------------------------------------------
FROM php:8.2-cli-alpine AS php-base

# Install PHP extensions needed for Laravel
RUN apk add --no-cache \
    sqlite-dev \
    && docker-php-ext-install pdo_sqlite

# -----------------------------------------------------------------------------
# Stage 2: Install Composer dependencies
# -----------------------------------------------------------------------------
FROM composer:2 AS composer-builder

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies without dev packages for production
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# Copy application code
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# -----------------------------------------------------------------------------
# Stage 3: Build frontend assets (needs PHP for wayfinder plugin)
# -----------------------------------------------------------------------------
FROM php:8.2-cli-alpine AS frontend-builder

# Install Node.js and PHP extensions
RUN apk add --no-cache \
    nodejs \
    npm \
    sqlite-dev \
    && docker-php-ext-install pdo_sqlite

WORKDIR /app

# Copy composer dependencies and application from previous stage
COPY --from=composer-builder /app /app

# Install npm dependencies
RUN npm ci

# Build frontend assets (wayfinder plugin will now find PHP)
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Production image
# -----------------------------------------------------------------------------
FROM php:8.2-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    sqlite \
    sqlite-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy custom PHP configuration
COPY docker/php/php.ini "$PHP_INI_DIR/conf.d/99-custom.ini"

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# Copy application from composer stage
COPY --from=composer-builder /app /var/www/html

# Copy built frontend assets
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Create necessary directories
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    database

# Create SQLite database file
RUN touch database/database.sqlite

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod 664 /var/www/html/database/database.sqlite

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Start supervisor (manages nginx + php-fpm)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
