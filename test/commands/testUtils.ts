import { PassThrough } from 'stream';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createConnection } from 'vscode-languageserver/node.js';
import { TextEdit } from 'vscode-languageclient';
import { EmptyFileSystem } from 'langium';
import { parseHelper } from 'langium/test';
import type { LangiumDocument } from 'langium';
import { createEraserServices } from '../../src/language/eraser/eraser-module.js';
import { Model } from '../../src/language/generated/ast.js';
import { EraserCommands } from '../../src/language/eraser-commands/types.js';
import { eraserCommandRegistry } from '../../src/language/eraser-commands/registry.js';
import '../../src/language/eraser-commands/index.js';

/**
 * Set up a test for commands. The code here is really overly complicated and rough to follow. Sorry.
 * Here's way it is what it is - please improve if you can!
 * To test a command, we need three things:
 * 1. A document - this part is easy
 * 2. A connection that can actually write changes to that document - this part is annoying.
 * 3. To know when the command is done so we can test the output - this part is ugly.
 * The way we do #2 is to create a custom output handler (WritableStream) that calls applyEdit on the document.
 * The way do we #3 is to create a promise that resolves with the new document when the changes are applied.
 * Unfortunately, eraserCommandRegistry does not return the "applyEdit" function,
 * and even if it did, it seems to hang in tests.
 * Maybe that has something to do with how we create the connection :shrug:
 *
 * If tests do end up failing for weird reasons, see CustomOutputHandler.applyEdit as a likely culprit
 */
export function setupCommandTest() {
  let document: LangiumDocument<Model> | undefined;

  // This is all the machinery to let the output handler return the updated text document
  // and inform us that it is done
  let setTextDocument: ((textDocument: TextDocument) => void) | undefined;

  const customOutputHandler = new CustomOutputHandler(
    () => document,
    (textDocument) => setTextDocument?.(textDocument)
  );

  const connection = createConnection(new PassThrough(), customOutputHandler);
  const services = createEraserServices({ connection, ...EmptyFileSystem });
  const parse = parseHelper<Model>(services.Eraser);

  connection.listen();

  eraserCommandRegistry.init(services.shared, connection);

  const makeCommandContext = async (content: string) => {
    // add a newline because some things break without it
    document = await parse(content + '\n');

    const executeCommand = async <C extends keyof EraserCommands>(
      command: C,
      params: EraserCommands[C]
    ) => {
      // Set up the rpomise that our output handler will resolve
      const promise = new Promise<TextDocument>((resolve) => {
        setTextDocument = (textDoc: TextDocument) => {
          const oldGetText = textDoc.getText;
          textDoc.getText = () => {
            const text = oldGetText.call(textDoc);
            // remove the newline
            return text.substring(0, text.length - 1);
          };
          resolve(textDoc);
          setTextDocument = undefined;
        };
      });

      await eraserCommandRegistry.execute(command, document!.uri.toString(), params);

      return promise;
    };

    return { document, executeCommand };
  };

  return { makeCommandContext };
}

type Message = {
  params: {
    edit: {
      changes: {
        [key: string]: TextEdit[];
      };
    };
  };
};

/**
 * Custom output stream that directly applies edits to a document
 */
class CustomOutputHandler extends PassThrough {
  constructor(
    private getDocument: () => LangiumDocument<Model> | undefined,
    private setTextDocument: (textDoc: TextDocument) => void
  ) {
    super();
  }

  // biome-ignore lint/suspicious/noExplicitAny: easy for tests
  write(chunk: any, ...rest: any[]): boolean {
    const message = chunk.toString();
    const document = this.getDocument();

    if (document && message.includes('workspace/applyEdit') && document) {
      const parsedMessage = JSON.parse(message) as Message;

      this.applyEdit(parsedMessage, document);
    }

    return super.write(chunk, ...rest);
  }

  applyEdit(parsedMessage: Message, document: LangiumDocument<Model>) {
    const editParams = parsedMessage.params.edit.changes;
    const edits = Object.values(editParams)[0];

    const newContent = TextDocument.applyEdits(document.textDocument, edits);
    const newDoc = TextDocument.create(
      document.textDocument.uri,
      document.textDocument.languageId,
      document.textDocument.version + 1,
      newContent
    );

    this.setTextDocument(newDoc);
  }
}
