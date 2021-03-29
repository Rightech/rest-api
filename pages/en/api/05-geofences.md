---
title: Geofences
author: prohazko
locale: en
path: developers/http-api/geofences
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/geofences.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/geofences.d.ts)

### Geofence item

```ts
import type { Geoshape, Floor, Base } from "@rightech/api";

/// <_include path="@root/types/geofences.d.ts#Geofence" />
```

### Geofence shapes

```ts
/// <_include path="@root/types/geofences.d.ts#Geography" />
/// <_include path="@root/types/geofences.d.ts#GeographyType" />
/// <_include path="@root/types/geofences.d.ts#Geopoint" />
/// <_include path="@root/types/geofences.d.ts#Geoline" />
/// <_include path="@root/types/geofences.d.ts#Geoshape" />
```

## Objects API

### Start geofencing for object { id="POST /objects/:id/geofences/:geofence/start" }

```http
POST /objects/:id/geofences/:geofence/start HTTP/1.1
```

### Stop geofencing for object { id="POST /objects/:id/geofences/:geofence/stop" }

```http
POST /objects/:id/geofences/:geofence/stop HTTP/1.1
```

## Default API

```
// TODO: gen TOC here
```

### Get geofences { id="GET /geofences/:id?" }

```http
GET /geofences/:id? HTTP/1.1
```

### Create new geofence { id="POST /geofences" }

```http
POST /geofences HTTP/1.1

{
  "name": "test-geofence-01",
  "shape": {
    "type": "polygon",
    "points": [
      [55.7929823, 37.6594161],
      [55.8068284, 37.6673126],
      [55.7973731, 37.6565837]
    ]
  }
}
```

### Update geofence { id="PATCH /geofences/:id" }

```http
PATCH /geofences/:id HTTP/1.1

{
  "name": "test-geofence-01.00",
}
```

### Delete geofence { id="DELETE /geofences/:id" }

```http
DELETE /geofences/:id HTTP/1.1
```
