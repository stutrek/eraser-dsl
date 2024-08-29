import { EmptyFileSystem } from 'langium';
import { startLanguageServer } from 'langium/lsp';
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from 'vscode-languageserver/browser.js';
import { parse } from './eraser/eraser-parser.js';
import { EraserCommandMessage, EraserCommands } from './eraser-commands/types.js';
import { eraserCommandRegistry } from './eraser-commands/registry.js';
import './eraser-commands/index.js';
import { createAllServices } from './allServices.js';

// @ts-ignore
globalThis.parse = parse;

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared } = createAllServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared);

/**
 *
languageServer.postMessage({
    id: 4,
    jsonrpc: "2.0",
    method: 'eraserCommand',
    params: {
        elementId: '123',
        command: 'changeNodeName',
        params: {
            oldName: 'API gateway',
            newName: 'asdf'
        }
    }
})
 */

eraserCommandRegistry.init(shared, connection);

connection.onRequest(
  'eraserCommand',
  async <T extends keyof EraserCommands>(params: EraserCommandMessage<T>) => {
    const { command, elementId, params: commandParams } = params;
    try {
      await eraserCommandRegistry.execute(command, elementId, commandParams);
    } catch (e) {
      console.error(e);
    }
  }
);
