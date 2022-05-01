FROM nginx

EXPOSE 443 80

COPY nginx.conf /etc/nginx/nginx.conf
COPY bundle.crt /etc/ssl/bundle.crt
COPY fs.key     /etc/ssl/fs.key
#CMD ["nginx", "-g", "daemon off;"]