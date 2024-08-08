if [ -n "$SERVER_CA" ]; then
    echo "$SERVER_CA" > /chicken_pharm/server/certs/server-ca.pem
fi
if [ -n "$CLIENT_CERT" ]; then
    echo "$CLIENT_CERT" > /chicken_pharm/server/certs/client-cert.pem
fi
if [ -n "$CLIENT_KEY" ]; then
    echo "$CLIENT_KEY" > /chicken_pharm/server/certs/client-key.pem
fi
