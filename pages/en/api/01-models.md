---
title: Models
author: prohazko
locale: en
path: developers/http-api/models
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/main/oas3/schemas/models.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/main/types/models.d.ts)

### Model nodes

```ts
/// <_include path="@root/types/models.d.ts#BaseNode" />
/// <_include path="@root/types/models.d.ts#SystemNode" />
/// <_include path="@root/types/models.d.ts#EventNode" />
/// <_include path="@root/types/models.d.ts#ArgumentNode" />
/// <_include path="@root/types/models.d.ts#ActionNode" />
/// <_include path="@root/types/models.d.ts#ModelNode" />
```

### Model item

```ts
import type { BaseItem } from "@rightech/api";

/// <_include path="@root/types/models.d.ts#Model" />
```

## Models API

```
// TODO: gen TOC here
```

### Get base models { id="GET /models/base" }

```http
GET /models/base HTTP/1.1
```

### Get own models { id="GET /models" }

```http
GET /models HTTP/1.1
```

### Create new model { id="POST /models" }

```http
POST /models HTTP/1.1

{
    "base": "mqtt",
    "name": "api-test-01",
}
```

### Update model { id="PATCH /models/:id" }

```http
PATCH /models/:id HTTP/1.1

{
    "name": "api-test-01.00",
}
```

### Delete model { id="DELETE /models/:id" }

```http
DELETE /models/:id HTTP/1.1
```

## Model nodes API

```
// TODO: gen TOC here
```

### Attach model node { id="POST /models/:id/nodes" }

```
// TODO: additional query params table

- attachTo
- atIndex
```

```http
POST /models/:id/nodes HTTP/1.1

{
    "id": "floorTemperature",
    "type": "argument",
    "name": "Floor Temperature",
    "unit": "temperature-celsius",
    "dataType": "number",
}
```

### Update model node { id="PATCH /models/:id/nodes/:node" }

```http
PATCH /models/:id/nodes/:node HTTP/1.1

{
    "name": "Floor Temperature (in Fahrenheits)",
    "unit": "temperature-fahrenheit"
}
```

### Delete model node { id="DELETE /models/:id/nodes/:node" }

```http
DELETE /models/:id/nodes/:node HTTP/1.1
```
