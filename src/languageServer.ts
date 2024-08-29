import { EraserCommands } from './language/eraser-commands/types.js';

let lsWorker: Worker;

export function getLanguageServer() {
  if (!lsWorker) {
    lsWorker = new Worker(new URL('./language/main-browser', import.meta.url), {
      type: 'module',
      name: 'Eraser Language Server',
    });
  }
  return lsWorker;
}

let currentId = 1;

export function executeEraserCommand(
  command: keyof EraserCommands,
  elementId: string,
  params: EraserCommands[keyof EraserCommands]
) {
  const languageServer = getLanguageServer();
  languageServer.postMessage({
    id: currentId++,
    jsonrpc: '2.0',
    method: 'eraserCommand',
    params: {
      elementId,
      command,
      params,
    },
  });
}

// @ts-ignore for debugging and development
window.executeEraserCommand = executeEraserCommand;
