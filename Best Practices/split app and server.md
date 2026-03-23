# Split app and server

app.ts defines the Express app (middleware + routes) only, so tests can import it and send requests without opening a real port.

server.ts handles runtime bootstrapping (env, Mongo connect, app.listen), which is process-level behavior and not ideal inside tests.

This avoids side effects on import (e.g., accidental DB connect/listen when a test file loads modules).

It also keeps local/dev behavior unchanged: you still run the server from server.ts, while tests target app.ts.
