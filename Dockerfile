FROM nginx:alpine

# Add the files #ADD /path/to/content /usr/html/
COPY dist /usr/share/nginx/html/


# RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
#     ln -sf /dev/stderr /var/log/nginx/error.log
