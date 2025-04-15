# Docker Setup for Resume Schema Parser

This document explains how to run the Resume Schema Parser application using Docker.

## Giới thiệu

Ứng dụng Resume Schema Parser được xây dựng bằng React và được containerized bằng Docker. Cấu trúc Docker gồm:

- **Môi trường phát triển**: Sử dụng Node.js trực tiếp với hot-reloading
- **Môi trường sản xuất**: Sử dụng Nginx để phục vụ các file tĩnh được build từ React

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Docker Configuration Files

The project includes the following Docker files:

- `Dockerfile` - Production-ready Docker configuration with Nginx
- `Dockerfile.dev` - Development-focused Docker configuration with Node.js
- `docker-compose.yml` - Production Docker Compose configuration
- `docker-compose.dev.yml` - Development Docker Compose configuration
- `.dockerignore` - Specifies files to exclude from Docker build
- `nginx.conf` - Nginx configuration for serving React application

## Running in Production Mode

To build and run the application in production mode:

```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

Application will be available at http://localhost

## Running in Development Mode

For development with hot-reloading:

```bash
# Build and start the application in development mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop the application
docker-compose -f docker-compose.dev.yml down
```

Application will be available at http://localhost:3000

## Common Docker Commands

```bash
# Rebuild the containers (needed after dependencies change)
docker-compose build
# or for development:
docker-compose -f docker-compose.dev.yml build

# Enter the container shell
docker exec -it resume-schema-parser /bin/sh
# or for development:
docker exec -it resume-schema-parser-dev /bin/sh

# Check container status
docker-compose ps
# or for development:
docker-compose -f docker-compose.dev.yml ps
```

## Modifying the Docker Configuration

If you need to make changes to the Docker configuration:

1. Edit the appropriate Dockerfile or docker-compose.yml file
2. Rebuild the container(s) using: `docker-compose build` or `docker-compose -f docker-compose.dev.yml build`
3. Restart the container(s) using: `docker-compose up -d` or `docker-compose -f docker-compose.dev.yml up -d`

## Volumes

The production setup includes a volume mount for data persistence at `./data:/app/data`. This can be used to store any persistent data your application needs.

## Networks

The Docker Compose configuration creates isolated networks named `resume-network` (production) and `resume-network-dev` (development) for container communication.

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker-compose logs -f`
2. Verify container status: `docker-compose ps`
3. Ensure your Docker and Docker Compose versions are up to date
4. Try rebuilding without cache: `docker-compose build --no-cache`

### Common Problems and Solutions

#### Package Version Conflicts

If you see errors related to package versions or unsupported engines:

```
npm warn EBADENGINE Unsupported engine {
  package: 'react-router@7.1.1',
  required: { node: '>=20.0.0' },
  current: { node: 'v18.x.x', npm: 'x.x.x' }
}
```

This means some packages require a newer version of Node.js. The Dockerfiles have been configured to use Node.js 22, which should resolve these issues.

#### Package Lock File Sync Issues

If you see errors like:

```
npm ci can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync
```

This happens when package.json has been updated but package-lock.json hasn't been regenerated. To fix:

1. Locally run: `npm install` to regenerate your package-lock.json
2. Commit the updated package-lock.json
3. Rebuild your Docker image: `docker-compose build --no-cache`

Alternatively, the Dockerfile now uses `npm install` instead of `npm ci` to automatically sync the package-lock.json file during build.

#### Nginx Configuration Issues

If you're experiencing routing problems in production (404 errors when accessing routes directly), check the nginx.conf file. The current configuration already handles SPA routing by redirecting requests to index.html with:

```
try_files $uri $uri/ /index.html;
```

If you need to modify the Nginx configuration, edit the nginx.conf file and rebuild the production container. 