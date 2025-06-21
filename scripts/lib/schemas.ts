import { JSONSchema, Schema } from 'effect';

// Schema for a single item in the 'items' list
const ListItemSchema = Schema.Struct({
  name: Schema.String,
  url: Schema.String,
  description: Schema.optional(Schema.String),
});

// Schema for the entire list file structure
const ListFileSchema = Schema.Struct({
  category: Schema.Struct({
    name: Schema.String,
  }),
  items: Schema.Array(ListItemSchema),
});

// Export the schemas for potential use elsewhere
export { ListFileSchema, ListItemSchema };

// Generate and log the JSON schema

const ListFileJsonSchema = JSONSchema.make(ListFileSchema);

console.log(JSON.stringify(ListFileJsonSchema, null, 2));
