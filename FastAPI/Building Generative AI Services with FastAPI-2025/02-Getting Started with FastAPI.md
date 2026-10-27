# Getting Started with FastAPI

```sh
pip install "fastapi[standard]" uvicorn openai
```

```py
from fastapi import FastAPI
from openai import OpenAI

app = FastAPI() 
openai_client = OpenAI(api_key="your_api_key") 

@app.get("/")
def root_controller():
    return {"status": "healthy"}

@app.get("/chat") 
def chat_controller(prompt: str = "Inspire me"): 
    response = openai_client.chat.completions.create( 
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    statement = response.choices[0].message.content
    return {"statement": statement}
```

## FastAPI Features and Advantages

- Inspired by Flask Routing Pattern
- Handling Asynchronous and Synchronous Operations
- Built-In Support for Background Tasks
- Custom Middleware and CORS Support
- Freedom to Customize Any Service Layer
- Data Validation and Serialization
- Rich Ecosystem of Plug-Ins
- Automatic Documentation
- Dependency Injection System
- Lifespan Events
- Security and Authentication Components
- Bidirectional Web Socket, GraphQL, and Custom Response Support

## FastAPI Project Structures

Flat Structure

```txt
flat-project
├── app
│   ├── services.py
│   ├── database.py
│   ├── models.py
│   ├── routers.py
│   └── main.py
├── requirements.txt
├── .env
├── .gitignore
```

Nested Structure

```txt
nested-project
├── app
│    ├── main.py
│    ├── dependencies.py
│    └── services
│    │   ├── users.py
│    │   └── profiles.py
│    └── models
│    │   ├── users.py
│    │   └── profiles.py
│    └── routers
│        ├── users.py
│        └── profiles.py
├── requirements.txt
├── .env
├── .gitignore
```

Modular Structure

```ts
modular-project
├── app
│   └── modules
│   │   ├── auth
│   │   │   ├── routers.py
│   │   │   ├── models.py
│   │   │   ├── dependencies.py
│   │   │   ├── guards.py
│   │   │   ├── services.py
│   │   └── users
│   │   │   ├── router.py
│   │   │   ├── models.py
│   │   │   ├── dependencies.py
│   │   │   ├── services.py
│   │   │   ├── mappers.py
│   │   │   ├── pipes.py
│   │   └── profiles
│   └── routers
│   │   └── users.py
│   └── providers
│   │   └── email.py
│   │   └── stripe.py
............
│   ├── settings.py  # global configs
│   ├── middlewares.py  # global middleware
│   ├── models.py  # global models
│   ├── exceptions.py  # global exceptions
│   └── main.py
├── requirements.txt
├── .env
├── .gitignore
```

## FastAPI Limitations

Inefficient Model Memory Management
Limited Number of Threads
Restricted to Global Interpreter Lock
Lack of Support for Micro-Batch Processing Inference Requests
Cannot Efficiently Split AI Workloads Between CPU and GPU
Dependency Conflicts
Lack of Support for Resource-Intensive AI Workloads

## Tooling

Using uv or Conda for pip-driven workflows

Using Poetry for more complex projects

Linters: Autoflake, Flake8
