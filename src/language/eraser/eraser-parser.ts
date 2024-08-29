import { createLangiumParser, EmptyFileSystem } from 'langium';
import { createEraserServices } from './eraser-module.js';

export function parse(code: string) {
  const services = createEraserServices({ connection: undefined, ...EmptyFileSystem });
  const parser = createLangiumParser(services.Eraser);

  return parser.parse(code);
}
