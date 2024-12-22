#FROM nginx:1.20-alpine
FROM nginx:1.20

ENV TZ=UTC

# nginxの設定ファイルをコピー
COPY ./nginx/*.conf /etc/nginx/conf.d/
COPY ./certs/localhost.crt /etc/nginx/ssl/localhost.crt
COPY ./certs/localhost.key /etc/nginx/ssl/localhost.key


WORKDIR /var/www/html