# =============================================================================
# Makefile for Al-Nader Real Estate Docker Operations
# =============================================================================
# Usage:
#   make build    - Build Docker image
#   make up       - Start containers
#   make down     - Stop containers
#   make logs     - View logs
#   make shell    - Access container shell
#   make fresh    - Rebuild everything from scratch
# =============================================================================

.PHONY: help build up down logs shell fresh clean migrate seed

# Default target
help:
	@echo "Al-Nader Real Estate - Docker Commands"
	@echo "========================================"
	@echo ""
	@echo "  make build     Build the Docker image"
	@echo "  make up        Start the application"
	@echo "  make down      Stop the application"
	@echo "  make restart   Restart the application"
	@echo "  make logs      View application logs"
	@echo "  make shell     Access container shell"
	@echo "  make artisan   Run artisan command (use: make artisan cmd='migrate')"
	@echo "  make fresh     Rebuild everything from scratch"
	@echo "  make clean     Remove all containers and volumes"
	@echo ""

# Build the Docker image
build:
	@echo "🔨 Building Docker image..."
	docker compose build --no-cache

# Start containers
up:
	@echo "🚀 Starting application..."
	docker compose up -d
	@echo ""
	@echo "✅ Application is running at http://localhost:8080"

# Stop containers
down:
	@echo "🛑 Stopping application..."
	docker compose down

# Restart containers
restart: down up

# View logs
logs:
	docker compose logs -f app

# Access container shell
shell:
	docker compose exec app sh

# Run artisan command
artisan:
	docker compose exec app php artisan $(cmd)

# Run migrations
migrate:
	docker compose exec app php artisan migrate --force

# Seed database
seed:
	docker compose exec app php artisan db:seed --force

# Fresh install (rebuild everything)
fresh: clean build up
	@echo ""
	@echo "🎉 Fresh installation complete!"
	@echo "   Application: http://localhost:8080"

# Clean everything
clean:
	@echo "🧹 Cleaning up..."
	docker compose down -v --remove-orphans
	docker image rm alnader-app 2>/dev/null || true
	@echo "✅ Cleanup complete"

# Development: Build and run with live output
dev:
	docker compose up --build

# Production: Build optimized image
prod:
	docker compose -f docker-compose.yml build
	docker compose -f docker-compose.yml up -d

# Show container status
status:
	docker compose ps

# Health check
health:
	@curl -sf http://localhost:8080/up && echo "✅ Application is healthy" || echo "❌ Application is not responding"
