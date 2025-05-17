FROM docker.io/node:22-alpine

# Certicate
ENV CERT_HOME=/usr/local/share/ca-certificates
ENV CERT_FILE_PATH=${CERT_HOME}/zscaler_chain_root-int.pem
RUN mkdir -p ${CERT_HOME}
ADD zscaler_chain_root-int.pem ${CERT_FILE_PATH}

# npm settings
ARG ADD_CERT
RUN if [ "$ADD_CERT" = "true" ]; then npm config set cafile ${CERT_FILE_PATH}; else echo "No CA cert added."; fi
