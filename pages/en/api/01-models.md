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
/// <reference path="@root/types/models.d.ts#BaseNode" />
/// <reference path="@root/types/models.d.ts#SystemNode" />
/// <reference path="@root/types/models.d.ts#EventNode" />
/// <reference path="@root/types/models.d.ts#ArgumentNode" />
/// <reference path="@root/types/models.d.ts#ActionNode" />
/// <reference path="@root/types/models.d.ts#ModelNode" />
```

### Model item

```ts
/// <reference path="@root/types/models.d.ts#Model" />
```

## Get base models { id="GET /models/base" }

```http
GET {{RIC_BASE_URL}}/api/v1/models/base HTTP/1.1
```

## Get own models { id="GET /models" }

```http
GET {{RIC_BASE_URL}}/api/v1/models HTTP/1.1
```

## Create new model { id="POST /models" }

```http
POST {{RIC_BASE_URL}}/api/v1/models HTTP/1.1
Content-Type: application/json

{
    "base": "mqtt"
    "name": "api-test-01",
}
```
