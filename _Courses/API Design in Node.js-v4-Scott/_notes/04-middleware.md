# Middleware

Middleware are functions that run right before your handlers run. They can do things like augment
the request, log, handle errors, authenticate, and pretty much anything else. They look exactly like a
handler with one difference. Because you can have a list of middleware, there needs to be a
mechanism to move into the next middleware function when work is done in the current.
