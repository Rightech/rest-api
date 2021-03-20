---
title: Objects
author: prohazko
locale: en
path: developers/http-api/objects
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/objects.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/objects.d.ts)

```ts
import type { ItemId, BaseItem } from "@rightech/api";

/// <_include path="@root/types/objects.d.ts#ServiceState" />
/// <_include path="@root/types/objects.d.ts#BaseState" />
/// <_include path="@root/types/objects.d.ts#BaseConfig" />
/// <_include path="@root/types/objects.d.ts#RicObject" />
```

## Default API

```
// TODO: gen TOC here
```

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


## Journal API

```
// TODO: gen TOC here
```

## Commands API

```
// TODO: gen TOC here
```
