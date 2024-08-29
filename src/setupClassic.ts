import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import { getClientConfiguration, defineUserServices } from './setupCommon.js';
import monarchSyntax from './syntaxes/eraser.monarch.js';

export const setupConfigClassic = (): UserConfig => {
  return {
    wrapperConfig: {
      serviceConfig: defineUserServices(),
      editorAppConfig: {
        $type: 'classic',
        useDiffEditor: false,
        languageDef: {
          languageExtensionConfig: {
            id: 'eraser',
          },
          ...monarchSyntax,
        },
        editorOptions: {
          'semanticHighlighting.enabled': true,
          theme: 'vs-dark',
        },
      },
    },
    languageClientConfig: getClientConfiguration('eraser'),
  };
};

export const executeClassic = async (htmlElement: HTMLElement) => {
  const userConfig = setupConfigClassic();
  const wrapper = new MonacoEditorLanguageClientWrapper();
  await wrapper.initAndStart(userConfig, htmlElement);
};
