import * as fs from 'fs';
import * as path from 'path';
import { ListFileSchema } from './lib/schemas';
import { Schema } from 'effect';

const ListFileJsonSchema = Schema.toJsonSchemaDocument(ListFileSchema);

const schemaPath = path.join(__dirname, '../schemas/list-schema.json');

fs.writeFileSync(schemaPath, JSON.stringify(ListFileJsonSchema, null, 2));

console.log(`Generated JSON schema and saved to ${schemaPath}`);
