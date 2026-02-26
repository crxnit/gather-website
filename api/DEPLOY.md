# Gather API — Docker Deployment

## Prerequisites

- Docker installed on the host
- Host IP whitelisted with Google Workspace for `smtp-relay.gmail.com` (the SMTP relay is IP-authenticated — no credentials are used)

## Build

From the `api/` directory:

```bash
docker build -t gather-api .
```

## Run

```bash
docker run -d --name gather-api -p 8000:8000 --restart unless-stopped gather-api
```

The API will be available at `http://localhost:8000`.

## Verify

```bash
# Health check — should return 405 (only POST is accepted)
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/submit

# Test with a POST (will fail email delivery if SMTP relay isn't reachable, but confirms the container is running)
curl -X POST http://localhost:8000/submit \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","_elapsed":5}'
```

## Traefik Integration

The production stack uses Traefik as a reverse proxy. Add labels to expose the API through Traefik:

```bash
docker run -d --name gather-api \
  --network traefik-net \
  --restart unless-stopped \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.gather-api.rule=Host(\`gathercateringandevents.com\`) && PathPrefix(\`/api\`)" \
  --label "traefik.http.routers.gather-api.entrypoints=websecure" \
  --label "traefik.http.routers.gather-api.tls.certresolver=letsencrypt" \
  --label "traefik.http.middlewares.gather-api-strip.stripprefix.prefixes=/api" \
  --label "traefik.http.routers.gather-api.middlewares=gather-api-strip" \
  --label "traefik.http.services.gather-api.loadbalancer.server.port=8000" \
  gather-api
```

This routes `https://gathercateringandevents.com/api/*` to the container on port 8000, stripping the `/api` prefix so the Go handler sees `/submit`.

## Logs

```bash
docker logs -f gather-api
```

## Rebuild & Redeploy

```bash
docker stop gather-api && docker rm gather-api
docker build -t gather-api .
# then run again with the appropriate command above
```

## Notes

- **SMTP relay**: The container must run on a host whose IP is authorized in Google Workspace Admin → Apps → Google Workspace → Gmail → Routing → SMTP relay. No credentials are baked into the image.
- **SMTP implementation**: The API uses `net/textproto` instead of Go's `net/smtp` package. Go's `net/smtp` hardcodes `EHLO localhost`, which Google's SMTP relay rejects with a 421. See `SMTP.md` for the full explanation and debugging history.
- **EHLO hostname**: Controlled by the `smtpHelo` constant in `main.go` (currently `gathercateringandevents.com`). If the domain changes, update this constant.
- **No TLS**: The SMTP relay is IP-authenticated on the internal network. The connection uses plain SMTP on port 25 without STARTTLS. No CA certificates are needed in the container.
- **Rate limiting**: The in-memory rate limiter resets when the container restarts. This is acceptable for the current traffic volume.
- **Stateless**: No volumes or persistent storage needed.
- **Port**: The API listens on `8000` inside the container. Map it to whatever host port suits your setup.
