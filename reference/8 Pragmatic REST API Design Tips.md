# 8 Pragmatic REST API Design Tips

https://www.youtube.com/watch?v=36--CQc19u4

Approach all best practices with a dose of pragmatism.

## 1. Be consistent

- plural nouns
- status code

## 2. Support standard HTTP methods

## 3. Return the correct HTTP status codes

## 4. Use plural nouns for resources

✅
GET /habits # get all the habits
GET /habits/{habit_id} # get one habits

❌
GET /habit
GET /habit/{habit_id}

## 5. Avoid deeply nested URL

GET users/{user_id}/habits/{habit_id}/entires ❌

GET entires?habitId={habits_id} ✅

## 6. Wrap arrays in an envelope

```json
{
  "data": [{}, {}]
}
```

## 7. Pagination

- Offset pagination
  GET /entries?habitId=h_01948a02-7118-7902-b1f4-afb25e883c2b&offset=10&limit=10

```sql
SELECT * FROM entries WHERE habitId=? LIMIT 10 OFFSET 10
```

如果数据被删除或新增，会导致数据“跳过”或重复, OFFSET 对大表性能差

- Cursor pagination
  GET /entries?habitId=h_01948a02-7118-7902-b1f4-afb25e883c2b&cursor=ZW50XzAxOTQ4ZjAwLTY5N2QtNzhjMi04ZDZjLTc0ZGI2ZTRjNzU00Q&limit=10

cursor 是上一次查询最后一条记录的标识（通常是主键或排序字段的 Base64 编码）

```sql
SELECT * FROM entries WHERE habitId = ? AND id > ?  -- 使用 cursor 作为起点
ORDER BY id ASC
LIMIT 10;
```

对数据变动敏感性低, 性能更好-尤其是大数据表, 可以无限滚动（infinite scroll）

Response for prev, next button

```json
{
  "data": [
    {
      "id": "ent_01948f03-2399-773a-bd80-b1a5ae89f483",
      "name": "item1"
    },
    {
      "id": "ent_01948f03-2399-773a-bd80-b1a5ae89f483",
      "name": "item2"
    },
    ...
  ],
  "links": [
    {
      "href": "https://api/entries?
              habitId=01948a02-7118-7902-b1f4-afb25e883c2b&
              limit=8",
      "rel": "first",
      "method": "GET"
    },
    {
      "href": "https://api/entries?
              habitId=01948a02-7118-7902-b1f4-afb25e883c2b&
              cursor=ZW50XzAxOTQ4ZjAwLTY5N2QtNzhjMi04ZDZjLTc0ZGI2ZTRjNzU00Q&
              limit=8",
      "rel": "next",
      "method": "GET"
    }
  ]
}
```

## Use a structured error format

```json
Content-Type: application/problem+json

{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Not Found",
  "status": 404,
  "instance": "http://api/habits/h_aadcad3f-8dc8-443d-be44-3d99893ba18a",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01",
  "requestId": "0HN7C8PRNMGIA:00000001"
}
```
