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

## Docker

```sh
docker pull python:3.6.15
docker run python:3.6.15 -it --rm

# reuse the container
docker start -ai <container_id_or_name>
```

## Dockerfile
