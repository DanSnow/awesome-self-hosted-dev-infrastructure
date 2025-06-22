import * as path from 'node:path';
import { FileSystem } from '@effect/platform';
import { NodeFileSystem } from '@effect/platform-node';
import { Edge } from 'edge.js';
import { Array, Console, Effect, Order, pipe, Schema } from 'effect';
import * as yaml from 'js-yaml';
import { ListFileSchema } from './lib/schemas'; // Assuming schemas.ts is in src/

const listsDir = path.join(__dirname, '../lists');
const readmePath = path.join(__dirname, '../README.md');

const edge = Edge.create();
edge.mount(path.join(__dirname, '../templates'));

const decodeList = Schema.decodeUnknown(ListFileSchema);

const listFiles = pipe(
  FileSystem.FileSystem,
  Effect.flatMap((fs) => fs.readDirectory(listsDir)),
  Effect.map(Array.filter((name) => name.endsWith('.yaml'))),
);

const readFile = Effect.fn('readFile')(function* (filePath: string) {
  const fs = yield* FileSystem.FileSystem;
  return yield* fs.readFileString(filePath);
});

const writeFile = Effect.fn('writeFile')(function* (
  filePath: string,
  content: string,
) {
  const fs = yield* FileSystem.FileSystem;
  return yield* fs.writeFileString(filePath, content);
});

const readLists = pipe(
  listFiles,
  Effect.flatMap((files) =>
    pipe(
      files,
      Array.map((file) =>
        Effect.gen(function* () {
          const fileContent = yield* readFile(path.join(listsDir, file));
          const parsedYaml = yaml.load(fileContent);
          // Validate with Effect schema
          const validatedData = yield* decodeList(parsedYaml);
          return validatedData;
        }),
      ),
      Effect.allWith({ concurrency: 'unbounded' }),
    ),
  ),
  Effect.map((lists) =>
    Array.sort(
      lists,
      Order.struct({
        category: Order.struct({
          name: Order.string,
        }),
      }),
    ),
  ),
);

const renderReadme = pipe(
  readLists,
  Effect.andThen((categories) => edge.render('readme', { categories })),
  Effect.map((readmeContent) => {
    // Replace instances of double newline followed by a list item marker
    // with a single newline followed by a list item marker.
    // This targets the extra blank line between list items.
    return readmeContent.replace(/\n\n- /g, '\n- ');
  }),
);

const main = pipe(
  renderReadme,
  Effect.flatMap((readme) =>
    Effect.gen(function* () {
      yield* writeFile(readmePath, readme);
      yield* Console.log('README.md generated successfully.');
    }),
  ),
);

pipe(main, Effect.provide(NodeFileSystem.layer), Effect.runPromise).catch(
  (error) => console.error(error),
);
