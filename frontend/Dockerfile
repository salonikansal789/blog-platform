# Build Stage
FROM node:18-bullseye AS build
WORKDIR /app

# Install dependencies using package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code & build
COPY . .
RUN npm run build

# Production Stage - Nginx
FROM nginx:stable-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output (dist folder) to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (for React Router SPA, optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
