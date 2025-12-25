# Idempotent

Performing the same operation `multiple times` produces the `same result` as performing it once.

This concept is very important in RESTful APIs, HTTP methods, and distributed systems.

## Simple Real-Life Example

Light switch (idempotent): turn light off always cause light off

Toggle switch cause different result

## Why Idempotency Matters

Network failures: Clients may retry requests, Idempotent operations are safe to retry
Distributed systems: Prevents duplicate operations

## Idempotency not equal to Same Response

DELETE /users/1 is idempotent:
First response: 200 OK,
Second response: 404 Not Found

##

GET, PUT, DELETE, OPTION are idempotent.

POST is not idempotent. POST’s semantics are to "submit and process data"; repeated identical requests may produce multiple side effects or different results on the server, while idempotency requires repeated executions to result in the same final state.

Whether PATCH is idempotent depends on the implementation:
if the PATCH describes "set to a specific state" it is idempotent;
if it describes a "one-time operation" (e.g., increment, append) it is not idempotent.
