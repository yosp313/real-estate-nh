# Docker Deployment Guide

## Al-Nader Real Estate Application

This guide explains how to run the Al-Nader Real Estate application using Docker.

---

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- At least 2GB free disk space

---

## Quick Start

### 1. Clone and Navigate
```bash
cd real-estate-nh
```

### 2. Set Up Environment
```bash
# Copy the Docker environment template
cp .env.docker .env

# Generate an application key (will be auto-generated on first run if not set)
# Or set manually: APP_KEY=base64:your-32-char-random-string
```

### 3. Build and Run
```bash
# Using Make (recommended)
make build
make up

# Or using Docker Compose directly
docker compose build
docker compose up -d
```

### 4. Access the Application
Open your browser and visit: **http://localhost:8080**

---

## Available Commands

### Using Makefile (Recommended)

| Command | Description |
|---------|-------------|
| `make build` | Build the Docker image |
| `make up` | Start the application |
| `make down` | Stop the application |
| `make restart` | Restart the application |
| `make logs` | View application logs |
| `make shell` | Access container shell |
| `make fresh` | Rebuild everything from scratch |
| `make clean` | Remove all containers and volumes |
| `make status` | Show container status |
| `make health` | Check application health |

### Using Docker Compose

```bash
# Build image
docker compose build

# Start in background
docker compose up -d

# View logs
docker compose logs -f app

# Stop
docker compose down

# Stop and remove volumes
docker compose down -v
```

---

## Configuration

### Environment Variables

Key environment variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 8080 | Host port to expose |
| `APP_ENV` | production | Environment mode |
| `APP_DEBUG` | false | Debug mode |
| `APP_KEY` | (generated) | Application encryption key |
| `DB_CONNECTION` | sqlite | Database driver |

### Ports

- **8080**: HTTP (Nginx → PHP-FPM)

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Docker Container              │
│  ┌─────────────────────────────────┐   │
│  │           Supervisor            │   │
│  │  ┌──────────┐  ┌─────────────┐  │   │
│  │  │  Nginx   │  │   PHP-FPM   │  │   │
│  │  │  :80     │──│   :9000     │  │   │
│  │  └──────────┘  └─────────────┘  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Laravel Application        │   │
│  │  /var/www/html                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Volumes:                               │
│  - sqlite_data → /database             │
│  - storage_data → /storage             │
└─────────────────────────────────────────┘
```

---

## Persistent Data

The following data is persisted across container restarts:

1. **SQLite Database**: `sqlite_data` volume
2. **Storage Files**: `storage_data` volume (uploads, logs)

To backup data:
```bash
# Backup SQLite database
docker compose cp app:/var/www/html/database/database.sqlite ./backup/

# Backup storage
docker compose cp app:/var/www/html/storage ./backup/storage
```

---

## Production Deployment

### 1. Build Optimized Image

```bash
docker compose build
```

### 2. Push to Registry (Optional)

```bash
docker tag real-estate-nh-app:latest your-registry/alnader-app:latest
docker push your-registry/alnader-app:latest
```

### 3. Deploy with SSL (Recommended)

For production with HTTPS, use a reverse proxy like Traefik or nginx-proxy:

```yaml
# docker-compose.prod.yml
services:
  app:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.alnader.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.alnader.tls.certresolver=letsencrypt"
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs app

# Verify image built correctly
docker compose build --no-cache
```

### Database issues
```bash
# Access container and run migrations manually
docker compose exec app sh
php artisan migrate:fresh --seed
```

### Permission issues
```bash
# Fix storage permissions inside container
docker compose exec app chown -R www-data:www-data /var/www/html/storage
```

### Health check failing
```bash
# Test health endpoint
curl http://localhost:8080/up
```

---

## Development with Docker

For development, you can mount source code as volumes:

```yaml
# docker-compose.dev.yml
services:
  app:
    volumes:
      - .:/var/www/html
      - /var/www/html/vendor
      - /var/www/html/node_modules
```

Run with:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## Support

For issues related to this Docker setup, check:
1. Container logs: `make logs`
2. Health status: `make health`
3. Container status: `make status`
