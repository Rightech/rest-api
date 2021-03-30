---
title: Objects
author: prohazko
locale: en
path: developers/http-api/objects
toc: true
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/objects.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/objects.d.ts)

### Object item

```ts
import type { ItemId, Base, State, Config } from "@rightech/api";

export interface RicObject extends Base {
  id: string;
  model: ItemId;

  state?: Readonly<State>;
  config?: Config;
}
```

### Object state

```ts
/// <_include path="@root/types/objects.d.ts#ServiceState" />
/// <_include path="@root/types/objects.d.ts#GeographyState" />
/// <_include path="@root/types/objects.d.ts#GeometryState" />
/// <_include path="@root/types/objects.d.ts#GpsState" />
/// <_include path="@root/types/objects.d.ts#MqttState" />
/// <_include path="@root/types/objects.d.ts#State" />
/// <_include path="@root/types/objects.d.ts#Config" />
```

## Default API

### Get objects { id="GET /objects/:id?" }

```http
GET /objects/:id? HTTP/1.1
```

### Create new object { id="POST /objects" }

```http
POST /objects HTTP/1.1

{
  "model": "<model-id>",
  "id": "test-object-01",
  "name": "test-object-01",
}
```

### Update object { id="PATCH /objects/:id" }

```http
PATCH /object/:id HTTP/1.1

{
  "name": "test-object-01.00",
}
```

### Delete object { id="DELETE /objects/:id" }

```http
DELETE /object/:id HTTP/1.1
```

## Commands API

### Send command to object { id="POST /objects/:id/commands/:command" }

```http
POST /objects/:id/commands/:command HTTP/1.1

{
  "topic": "test",
  "payload": "hi"
}
```

## Journal API

### Get packets history { id="GET /objects/:id/packets" }

```http
GET /objects/:id/packets HTTP/1.1
```
