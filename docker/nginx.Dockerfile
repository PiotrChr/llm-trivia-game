FROM nginx:latest

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Add our custom configuration
COPY ./nginx.conf /etc/nginx/conf.d/