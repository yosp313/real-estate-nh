#!/bin/sh
# =============================================================================
# Docker Entrypoint Script for Laravel Application
# =============================================================================

set -e

# Set working directory
APP_DIR="${APP_DIR:-/var/www/html}"
cd "$APP_DIR"

echo "🚀 Starting Al-Nader Real Estate Application..."

# -----------------------------------------------------------------------------
# Create .env file if it doesn't exist
# -----------------------------------------------------------------------------
if [ ! -f "$APP_DIR/.env" ]; then
    echo "📄 Creating .env file..."
    cat > "$APP_DIR/.env" << 'ENVFILE'
APP_NAME="النادر للعقارات"
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_AVAILABLE_LOCALES=en,ar

BCRYPT_ROUNDS=12

LOG_CHANNEL=stderr
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

FILESYSTEM_DISK=local

CACHE_STORE=file
QUEUE_CONNECTION=sync
ENVFILE
    chown www-data:www-data "$APP_DIR/.env" 2>/dev/null || true
fi

# -----------------------------------------------------------------------------
# Create log directories
# -----------------------------------------------------------------------------
mkdir -p /var/log/php /var/log/nginx 2>/dev/null || true
touch /var/log/php/error.log 2>/dev/null || true
chown -R www-data:www-data /var/log/php 2>/dev/null || true

# -----------------------------------------------------------------------------
# Ensure storage directories exist with correct permissions
# -----------------------------------------------------------------------------
echo "📁 Setting up storage directories..."
mkdir -p \
    "$APP_DIR/storage/app/public" \
    "$APP_DIR/storage/framework/cache/data" \
    "$APP_DIR/storage/framework/sessions" \
    "$APP_DIR/storage/framework/views" \
    "$APP_DIR/storage/logs" \
    "$APP_DIR/bootstrap/cache"

chown -R www-data:www-data "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

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
if [ -z "$DB_CONNECTION" ] || [ "$DB_CONNECTION" = "sqlite" ]; then
    DB_PATH="${DB_DATABASE:-$APP_DIR/database/database.sqlite}"
    
    # Ensure database directory exists
    mkdir -p "$(dirname "$DB_PATH")"
    
    if [ ! -f "$DB_PATH" ]; then
        echo "📦 Creating SQLite database..."
        touch "$DB_PATH"
        chown www-data:www-data "$DB_PATH" 2>/dev/null || true
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
if [ ! -L "$APP_DIR/public/storage" ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link --force
fi

# -----------------------------------------------------------------------------
# Final permissions check
# -----------------------------------------------------------------------------
chown -R www-data:www-data "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true

echo "✅ Application ready!"
echo "🌐 Server starting on port 80..."

# Execute the main command (supervisord)
exec "$@"
