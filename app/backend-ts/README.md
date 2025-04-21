## Setup

Copy `.env.example` to `.env` and update the values as needed.

```bash
cp .env.example .env
```

Set `docker-compose.yaml` environment `JWT_SECRET_KEY` to match the value in `.env`.

```yaml
services:
  backend-ts:
    environment:
      JWT_SECRET_KEY: secret
```
