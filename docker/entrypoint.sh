#!/bin/sh
# =============================================================================
# Docker Entrypoint Script for Laravel Application
# =============================================================================

set -e

echo "🚀 Starting Al-Nader Real Estate Application..."

# -----------------------------------------------------------------------------
# Create log directories
# -----------------------------------------------------------------------------
mkdir -p /var/log/php /var/log/nginx
touch /var/log/php/error.log
chown -R www-data:www-data /var/log/php

# -----------------------------------------------------------------------------
# Ensure storage directories exist with correct permissions
# -----------------------------------------------------------------------------
echo "📁 Setting up storage directories..."
mkdir -p \
    /var/www/html/storage/app/public \
    /var/www/html/storage/framework/cache/data \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# -----------------------------------------------------------------------------
# Generate application key if not set
# -----------------------------------------------------------------------------
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# -----------------------------------------------------------------------------
# Database setup (SQLite)
# -----------------------------------------------------------------------------
if [ "$DB_CONNECTION" = "sqlite" ]; then
    DB_PATH="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
    
    if [ ! -f "$DB_PATH" ]; then
        echo "📦 Creating SQLite database..."
        touch "$DB_PATH"
        chown www-data:www-data "$DB_PATH"
        chmod 664 "$DB_PATH"
    fi
fi

# -----------------------------------------------------------------------------
# Run migrations
# -----------------------------------------------------------------------------
echo "🗃️  Running database migrations..."
php artisan migrate --force --no-interaction

# -----------------------------------------------------------------------------
# Seed database if empty (optional - check for existing data)
# -----------------------------------------------------------------------------
PROJECT_COUNT=$(php artisan tinker --execute="echo App\Models\Project::count();" 2>/dev/null || echo "0")
if [ "$PROJECT_COUNT" = "0" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force --no-interaction
fi

# -----------------------------------------------------------------------------
# Clear and cache configuration for production
# -----------------------------------------------------------------------------
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# -----------------------------------------------------------------------------
# Create storage symlink
# -----------------------------------------------------------------------------
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link --force
fi

# -----------------------------------------------------------------------------
# Final permissions check
# -----------------------------------------------------------------------------
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Application ready!"
echo "🌐 Server starting on port 80..."

# Execute the main command (supervisord)
exec "$@"
