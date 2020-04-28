# Fullstack Shop

Uses the following technologies:

- Next.js
- GraphQL
- MongoDB
- Docker (and Docker Compose)
- AWS

## Setup

```sh
# in main directory
  docker-compose up
```

## Notes

```yml
# Docker containers defaults to UTC time zone, you can change with TZ environment
# variable but for consistency leave it as UTC. Otherwise you have to worry about
# date conversions 🤕.

environment:
  TZ: Europe/London
```
