---
title: Handlers
author: prohazko
locale: en
path: developers/http-api/handlers
toc: true
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/handlers.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/handlers.d.ts)

### Handler item

```ts
import type { ItemId, Base } from "@rightech/api";

/// <_include path="@root/types/handlers.d.ts#Handler" />
```

## Objects API

### Start handler for object { id="POST /objects/:id/handlers/:handler/start" }

```http
POST /objects/:id/handlers/:handler/start HTTP/1.1
```

### Stop handler for object { id="POST /objects/:id/handlers/:handler/stop" }

```http
POST /objects/:id/handlers/:handler/stop HTTP/1.1
```

## Default API

### Get handlers { id="GET /handlers/:id?" }

```http
GET /handlers/:id? HTTP/1.1
```

### Create new handler { id="POST /handlers" }

```http
POST /handlers HTTP/1.1

{
  "name": "test-handler-01",
  "userCode": "function process(a, b) { return a + b }"
}
```

### Update handler { id="PATCH /handlers/:id" }

```http
PATCH /handlers/:id HTTP/1.1

{
  "name": "test-handler-01.00",
}
```

### Delete handler { id="DELETE /handlers/:id" }

```http
DELETE /handlers/:id HTTP/1.1
```
