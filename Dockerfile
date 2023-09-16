# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=19.3.0
ARG PNPM_VERSION=8.6.12



################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/app

# Install pnpm.
RUN npm install -g pnpm@${PNPM_VERSION}

# Copy package.json and pnpm-lock.yaml files.
COPY package.json pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm install

# Copy the rest of the application.
COPY . .
# Generate prisma client.
RUN pnpm prisma-generate

# Build the application.

RUN pnpm build

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD pnpm start
