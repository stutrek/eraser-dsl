import { eraserCommandRegistry } from './registry.js';

eraserCommandRegistry.register('log', async (params, document, services) => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('document', document);
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('parse result', document.parseResult);
  return [];
});
