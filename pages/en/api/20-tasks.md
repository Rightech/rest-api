---
title: Tasks
author: prohazko
locale: en
path: developers/http-api/tasks
toc: true
---

## Type definitions { #types }

[JSON Schema](https://github.com/Rightech/rest-api/blob/master/oas3/schemas/geofences.yaml)
[Type Definitions](https://github.com/Rightech/rest-api/blob/master/types/geofences.d.ts)

### Task kind

```ts

```

### Task item

```ts

```

## Kinds API

### Get task kinds { id="GET /tasks/kinds" }

```http
GET /tasks/kinds HTTP/1.1
```


## Default API

### Get tasks { id="GET /tasks/:id?" }

```http
GET /tasks/:id? HTTP/1.1
```

### Create new task { id="POST /tasks" }

```http
POST /tasks HTTP/1.1

{
  "name": "test-tasks-01",
}
```

### Update task { id="PATCH /tasks/:id" }

```http
PATCH /tasks/:id HTTP/1.1

{
  "name": "test-task-01.00",
}
```

### Delete tasks { id="DELETE /tasks/:id" }

```http
DELETE /tasks/:id HTTP/1.1
```
