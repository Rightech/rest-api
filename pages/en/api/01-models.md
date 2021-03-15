---
title: Models
author: prohazko
locale: en
path: developers/http-api/models
---

## Type definitions { #types }

```typescript 
type BasicNode =  {
  id: string;
  name: string;
  type: 'subsystem' | 'argument' | 'action';
  active: boolean;

  children?: ModelNode[];
  description?: string;
}

export interface ModelNode {
  id: string;
  name: string;
  type: 'subsystem' | 'argument' | 'action';
  active: boolean;

  children?: ModelNode[];
  description?: string;

  /* this.type === 'argument */
  dataType?: string;
  unit?: string;

  /* this.type === 'action */
  service?: string;
  command?: string;
  params?: object;
}

```

## Get base models { #GET_/models/base }


## Get own models { #GET_/models }


## Create new model { #POST_/models }


