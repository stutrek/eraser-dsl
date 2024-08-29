import { LangiumSharedServices } from 'langium/lsp';
import { EraserCommandHandler, EraserCommands } from './types.js';
import { Connection } from 'vscode-languageserver';
import { LangiumDocument } from 'langium';
import { Model } from '../generated/ast.js';

// function elementIdToFileName(elementId: string): string {
//   return `file:///workspace/${elementId}.eraser`;
// }

export class _EraserCommandRegistry {
  private _services: LangiumSharedServices | undefined;
  private _connection: Connection | undefined;

  init(services: LangiumSharedServices, connection: Connection) {
    this._services = services;
    this._connection = connection;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private _commands: Partial<Record<keyof EraserCommands, EraserCommandHandler<any>>> = {};

  register<T extends keyof EraserCommands>(command: T, handler: EraserCommandHandler<T>): void {
    this._commands[command] = handler;
  }

  private getDocument(elementId: string) {
    if (!this._services) {
      throw new Error('EraserCommandRegistry not initialized');
    }
    // const uri = URI.parse(elementIdToFileName(elementId));
    // return this.services.shared.workspace.LangiumDocuments.getDocument(uri);
    return this._services.workspace.LangiumDocuments.all.head();
  }

  async execute(
    command: keyof EraserCommands,
    elementId: string,
    params: EraserCommands[keyof EraserCommands]
  ) {
    if (!this._services || !this._connection) {
      throw new Error('EraserCommandRegistry not initialized');
    }

    const handler = this._commands[command];
    if (!handler) {
      throw new Error(`Unable to execute ${command}, command not found`);
    }
    const document = this.getDocument(elementId) as LangiumDocument<Model>;
    if (!document) {
      throw new Error('Element not found');
    }
    const services = this._services.ServiceRegistry.getServices(document.uri);

    const ops = await handler(params, document, services);
    if (ops) {
      // I'm not sure what type this really needs to be.
      const opsToSend =
        'changes' in ops
          ? ops
          : {
              label: 'Eraser Command',
              edit: {
                changes: {
                  [document.uri.toString()]: ops,
                },
              },
            };

      // Would be nice if we could return this or otherwise let the caller know when edit is done
      // @ts-ignore this isn't part of the type, but it's there
      // I would like to find a better way.
      this._connection.workspace.applyEdit(opsToSend);
    }
  }
}

export const eraserCommandRegistry = new _EraserCommandRegistry();
