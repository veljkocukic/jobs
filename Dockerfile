FROM postgres:13

# Install PostGIS extension
RUN apt-get update \
    && apt-get install -y postgresql-13-postgis-3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get autoremove -y

# Create a directory for custom initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy the SQL script to the initialization scripts directory
COPY init.sql /docker-entrypoint-initdb.d/