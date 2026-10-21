# FastAPI Python Tutorial: Build an Analytics API from Scratch

<https://www.youtube.com/watch?v=tiBeLLv5GJo>

[Code](https://github.com/codingforentrepreneurs/analytics-api)

<https://www.bilibili.com/video/BV1tDjmzrEfn>

## Tech stack

- FastAPI
- Pydantic
- Timescale
- Docker

## Setup FastAPI

```sh
which python3
python3 -m venv .venv3

source ./.venv3/bin/activate
pip install fastapi
```

requirements.txt

```txt
fastapi==0.115.11
uvicorn
gunicorn
sqlmodel
pydantic
sqlalchemy
timescaledb
requests
python-decouple
psycopg[binary] # psycopg v3
# psycopg2-binary
```

## Run

```sh
uvicorn src.main:app --reload --app-dir src
```

## Docker

```sh
docker pull python:3.6.15
docker run python:3.6.15 -it --rm

# reuse the container
docker start -ai <container_id_or_name>
```

## Dockerfile

Dockerfile

analytics-api/boot/docker-run.sh

```sh
docker build -t analytics-api -f Dockerfile .
docker run analytics-api
```

## Docker compose

```sh
docker compose up --watch
docker compose down
docker compose run app /bin/bash
```

## API
