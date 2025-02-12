FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=myapp
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Add any custom MySQL configuration if needed
# COPY my.cnf /etc/mysql/conf.d/my.cnf

# Any initialization scripts can be placed in docker-entrypoint-initdb.d
# They will be automatically executed in alphabetical order
COPY ./init.sql /docker-entrypoint-initdb.d/
