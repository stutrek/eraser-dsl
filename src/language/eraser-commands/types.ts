import { LangiumCoreServices, LangiumDocument } from 'langium';
import { TextEdit } from 'vscode-languageclient';
import { Model } from '../generated/ast.js';

export type EraserCommands = {
  log: Record<string, never>;
  changeNodeName: {
    oldName: string;
    newName: string;
  };
  changeSetting: {
    nodeName: string;
    settingKey: string;
    settingValue: string | undefined;
  };
};

export type EraserCommandHandler<T extends keyof EraserCommands> = (
  params: EraserCommands[T],
  document: LangiumDocument<Model>,
  services: LangiumCoreServices
) => TextEdit[] | Promise<TextEdit[] | undefined> | undefined;

export type EraserCommandMessage<T extends keyof EraserCommands> = {
  command: T;
  elementId: string;
  params: EraserCommands[T];
};
