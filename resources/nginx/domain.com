limit_req_zone $binary_remote_addr zone=mylimit:10m rate=5r/s;


server {
    listen 80;
    server_name domain.com www.domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name llmtrivia.com www.llmtrivia.com;
    ssl_certificate /etc/letsencrypt/live/llmtrivia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/llmtrivia.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    limit_req zone=mylimit burst=10 nodelay;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 9001;
    server_name api.domain.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}