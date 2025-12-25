# Cursor Pagination in REST APIs

## 1. Cursor Pagination vs Offset Pagination

### Offset Pagination

```http
GET /entries?habitId=...&page=2&limit=10
```

Queries the database based on page number and offset.

```sql
SELECT * FROM entries WHERE habitId=? LIMIT 10 OFFSET 10;
```

**Problems:**

- Data changes (insertions/deletions) can cause duplicate or missing entries.
- OFFSET queries can be slow on large tables.

### Cursor Pagination

```http
GET /entries?habitId=...&cursor=XYZ&limit=10
```

`cursor`is a marker for the `last item` from the previous query (usually a unique ID or a timestamp).

```sql
SELECT * FROM entries WHERE habitId = ? AND id > ?
ORDER BY id ASC
LIMIT 10;
```

**Advantages:**

- More consistent with changing data.
- Better performance on large datasets.
- Supports infinite scrolling.

---

## 2. Generating a Cursor

1. Take the last record's unique identifier from the query results.
2. Encode it as a Base64 or URL-safe string.
3. Send it as the `cursor` in the next request.

```js
// Node.js example
const lastEntryId = entries[entries.length - 1]._id;
const cursor = Buffer.from(lastEntryId.toString()).toString("base64");
```

---

## 3. Backend Implementation Example (Node.js + MongoDB)

```js
const limit = parseInt(req.query.limit) || 10;
const cursor = req.query.cursor; // get cursor form request
const habitId = req.query.habitId;

let query = { habitId };

if (cursor) {
  const lastId = Buffer.from(cursor, "base64").toString("ascii");
  query._id = { $gt: lastId }; // Adjust if using a different sorting field
}

const entries = await Entry.find(query).sort({ _id: 1 }).limit(limit);

let nextCursor = null;
if (entries.length > 0) {
  nextCursor = Buffer.from(entries[entries.length - 1]._id.toString()).toString(
    "base64"
  );
}

res.json({
  data: entries,
  nextCursor, // send cursor to frontend
});
```

---

## 4. Frontend Usage

- **Initial request without cursor:**

```http
GET /entries?habitId=h_01948a02-7118-7902-b1f4-afb25e883c2b&limit=10
```

Response includes `nextCursor`

- **Next request:**

```http
GET /entries?habitId=...&cursor=nextCursor&limit=10
```

This creates a loop for safe and consistent pagination.
