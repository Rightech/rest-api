---
title: Logic
author: prohazko
locale: en
path: developers/http-api/logic
toc: true
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/logic.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/logic.d.ts)

### Automaton item

```ts
import type { ItemId, Base } from "@rightech/api";

/// <_include path="@root/types/logic.d.ts#Automaton" />
```

## Objects API

### Start automaton for object { id="POST /objects/:id/automatons/:automaton/start" }

```http
POST /objects/:id/automatons/:automaton/start HTTP/1.1
```

### Stop automaton for object { id="POST /objects/:id/automatons/:automaton/stop" }

```http
POST /objects/:id/automatons/:automaton/stop HTTP/1.1
```

## Default API

### Get automatons { id="GET /automatons/:id?" }

```http
GET /automatons/:id? HTTP/1.1
```

### Update automaton { id="PATCH /automatons/:id" }

```http
PATCH /automatons/:id HTTP/1.1

{
  "name": "test-object-01.00",
}
```

### Delete automaton { id="DELETE /automatons/:id" }

```http
DELETE /automatons/:id HTTP/1.1
```
