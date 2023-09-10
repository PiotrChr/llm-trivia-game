limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# HTTP Redirects to HTTPS for llmtrivia.com and www.llmtrivia.com
server {
    if ($host = www.llmtrivia.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = llmtrivia.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name llmtrivia.com www.llmtrivia.com;
    return 301 https://$host$request_uri;
}

# HTTPS Configuration for llmtrivia.com and www.llmtrivia.com
server {
    listen 443 ssl;
    server_name llmtrivia.com www.llmtrivia.com;

    ssl_certificate /etc/letsencrypt/live/llmtrivia.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/llmtrivia.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    limit_req zone=mylimit burst=10 nodelay;

    location / {
        root /var/www/html/llmtrivia.com/frontend/public;
        try_files $uri /index.html;
    }
}

# HTTP Redirect to HTTPS for api.llmtrivia.com
server {
    listen 80;
    server_name api.llmtrivia.com;
    return 301 https://$host$request_uri;
}

# HTTPS Configuration for api.llmtrivia.com
server {
    listen 443 ssl;
    server_name api.llmtrivia.com;

    ssl_certificate /etc/letsencrypt/live/llmtrivia.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/llmtrivia.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:9002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}