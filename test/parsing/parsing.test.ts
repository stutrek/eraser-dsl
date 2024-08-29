import { beforeAll, describe, expect, test } from 'vitest';
import { EmptyFileSystem } from 'langium';
import type { LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import { createEraserServices } from '../../src/language/eraser/eraser-module.js';
import { Model } from '../../src/language/generated/ast.js';

let parse: (code: string) => Promise<LangiumDocument<Model> | undefined>;

beforeAll(async () => {
  const services = createEraserServices(EmptyFileSystem);
  parse = parseHelper<Model>(services.Eraser);

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Parsing tests', () => {
  test('parses nodes', async () => {
    const document = await parse(`
A
B
`);

    expect(document?.parseResult.value.nodes).toHaveLength(2);
  });
});
