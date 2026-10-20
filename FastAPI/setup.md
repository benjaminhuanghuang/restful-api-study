# FastAPI Setup

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

Uvicorn 和 Gunicorn 都是 Python 生态中最主流的 Web 应用服务器. 区别在于所支持的协议标准不同：
Gunicorn 专为传统的同步（WSGI）设计，而 Uvicorn 专为现代的异步（ASGI）设计。

## Run

```sh
uvicorn main:app --reload
```
