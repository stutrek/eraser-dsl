import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import * as monaco from 'monaco-editor';

import { getClientConfiguration, defineUserServices } from './setupCommon.js';

export const setupConfigExtended = (
  fileName: string,
  options: monaco.editor.IStandaloneEditorConstructionOptions
): UserConfig => {
  const extensionFilesOrContents = new Map();
  extensionFilesOrContents.set(
    '/language-configuration.json',
    new URL('../language-configuration.json', import.meta.url)
  );
  extensionFilesOrContents.set(
    '/eraser-grammar.json',
    new URL('../syntaxes/eraser.tmLanguage.json', import.meta.url)
  );
  extensionFilesOrContents.set(
    '/erd-grammar.json',
    new URL('../syntaxes/erasererd.tmLanguage.json', import.meta.url)
  );

  const languageClient = getClientConfiguration(options.language || 'eraser');

  return {
    id: fileName,
    wrapperConfig: {
      serviceConfig: defineUserServices(),
      editorAppConfig: {
        $type: 'extended',
        useDiffEditor: false,
        extensions: [
          {
            config: {
              name: 'eraser-web',
              publisher: 'generator-langium',
              version: '1.0.0',
              engines: {
                vscode: '*',
              },
              contributes: {
                languages: [
                  {
                    id: 'eraser',
                    extensions: ['.eraserdiagram'],
                    configuration: './language-configuration.json',
                  },
                  {
                    id: 'erasererd',
                    extensions: ['.erasererd'],
                    configuration: './language-configuration.json',
                  },
                ],
                grammars: [
                  {
                    language: 'eraser',
                    scopeName: 'source.eraser',
                    path: './eraser-grammar.json',
                  },
                  {
                    language: 'erasererd',
                    scopeName: 'source.erasererd',
                    path: './erd-grammar.json',
                  },
                ],
              },
            },
            filesOrContents: extensionFilesOrContents,
          },
        ],
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.semanticHighlighting.enabled': true,
          }),
        },
        editorOptions: options,
      },
    },
    languageClientConfig: languageClient,
  };
};

export const executeExtended = (
  htmlElement: HTMLElement,
  fileName: string,
  options: monaco.editor.IStandaloneEditorConstructionOptions
) => {
  const userConfig = setupConfigExtended(fileName, options);
  const wrapper = new MonacoEditorLanguageClientWrapper();
  return wrapper.initAndStart(userConfig, htmlElement).then(() => wrapper);
};
