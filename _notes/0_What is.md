# What is restful

The URL represents what you are working with, and the HTTP method represents what you want to do with it.

RESTful means: Following the principles of REST (Representational State Transfer)

- Representational: resources are represented in a format such as JSON
- State: the current state of a resource, such as a user or order
- Transfer: that representation is transferred between client and server

## HTTP methods

| HTTP Method | Action                         | Example             |
| ----------- | ------------------------------ | ------------------- |
| `GET`       | Read                           | `GET /users/123`    |
| `POST`      | Create                         | `POST /users`       |
| `PUT`       | Replace/update entire resource | `PUT /users/123`    |
| `DELETE`    | Delete                         | `DELETE /users/123` |
| `PATCH`     | Partially update               | `PATCH /users/123`  |

## Idempotent

Performing the same operation multiple times produces the same result as performing it once.

This concept is very important in RESTful APIs, HTTP methods, and distributed systems.

- POST ❌
- PATCH ⚠️

```json
PATCH /users/123
{
  "operation": "incrementAge"
}
```
