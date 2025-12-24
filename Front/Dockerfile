# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
# prefer pnpm if available
RUN apk add --no-cache git python3 build-base && \
    npm i -g pnpm@8
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY . .
# allow lockfile mismatch in CI/container builds; update lockfile locally if you want strict reproducibility
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# runtime stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx: serve index.html for SPA routes
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]