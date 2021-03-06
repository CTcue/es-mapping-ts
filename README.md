# Es Mapping TS

[![GitHub version](https://img.shields.io/badge/licence-MIT-green.svg)](https://github.com/xrobert35/es-mapping-ts)
[![Build Status](https://travis-ci.org/xrobert35/es-mapping-ts.svg?branch=master)](https://travis-ci.org/xrobert35/es-mapping-ts)
[![Coverage Status](https://coveralls.io/repos/github/xrobert35/es-mapping-ts/badge.svg)](https://coveralls.io/github/xrobert35/es-mapping-ts)
#### This library is used to generate elasticsearch mapping through typescript decorator

## Installation

```sh
npm install es-mapping-ts --save
```

## Exemple

### Create the mapping 
```typescript
import { EsEntity, EsField } from 'es-mapping-ts';
import { ObjectEntity } from './object.entity';
import { NestedEntity } from './nested.entity';

@EsEntity({
  index: 'master',
  type: 'masterType'
})
export class MasterEntity {

  @EsField({
    type : 'text'
  })
  name?: string;

  @EsField({
    type: 'text',
    copy_to : 'name'
  })
  firstname: string;

  @EsField({
    type: 'text',
    copy_to : 'name'
  })
  lastname: string;

  @EsField({
    type: 'join',
    relations: { 'master': 'submaster' }
  })
  master: Array<MasterEntity>;

  @EsField({
    type: 'object',
    fieldClass: ObjectEntity
  })
  objects: Array<MasterEntity>;

  @EsField({
    type: 'nested',
    fieldClass: NestedEntity
  })
  nesteds: Array<NestedEntity>;
}
```

```typescript
import { EsEntity, EsField } from 'es-mapping-ts';

@EsEntity({
  index: 'nested'
})
export class NestedEntity {

  @EsField({
    type: 'text',
  })
  name: string;

  @EsField({
    type: 'integer'
  })
  montant: number;
}
```

```typescript
import { EsEntity, EsField } from 'es-mapping-ts';

// This es entity is only here for field mapping, 
// it's not supposed to have is own index
@EsEntity()
export class ObjectEntity {

  @EsField({
    type: 'text',
    analyzer : 'whitespace'
  })
  name: string;

  @EsField({
    type: 'integer',
  })
  age: number;
}
```

### Get the generated mappings

#### Simply call the "uploadMappings"  function
```typescript
import { EsMappingService } from 'es-mapping-ts';
import { Client } from 'elasticsearch';

const esClient = new Client({
  host: 'http://localhost:9200',
  log : 'info'
});

// Upload the mapping
const mappings = EsMappingService.getInstance().uploadMappings(esClient);
```

only none readonly entity will be uploaded

#### or do it yourself

```typescript
import { EsMappingService } from 'es-mapping-ts';

//List of ready to use generated mapping
const mappings = EsMappingService.getInstance().getMappings();

Bluebird.each(mappings, async (mapping) => {
    //create index
    await esclient.indices.create({ index: mapping.index  });

    //create mapping
    await esclient.indices.putMapping(mapping);
});
```

## Decorator liste

#### @EsEntity
| Param | Type |  Description |
| ------ | ------ | ------ |
| index | string | Allow you to define the index name |
| type | string | Allow you to define the index type |
| readonly | boolean | Define if the mapping must be uploaded when using uploadMappings function |

#### @EsField
| Param | Type |  Description |
| ------ | ------ | ------ |
| type | string | Allow you to define the type of the index |
| name | string | Allow you to define the name of the property if different from the property name |
| dynamic | boolean | Allow you to define if the field can accept additional properties |
| analyzer | string | Allow you to define the elasticsearch analyzer |
| fields | string | Allow you to define the elasticsearch fields |
| format | string | Allow you to define the format (ie for date field) |
| enabled | boolean | Allow you to enable ou disable the field |
| null_value | string | Allow you to define the null value of the field |
| copy_to | string | Allow you to copy the field value into a group field for _search |
| relations | string | Define the releation for a join type |
| fieldClass | string | Class used to get the properties of the nested or object array type |

Additional properties are allowed, allowing you to manage other elasticsearch properties

# License
----

MIT
