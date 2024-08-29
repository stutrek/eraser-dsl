import { CstNode } from 'langium';
import { Setting } from '../generated/ast.js';
import { eraserCommandRegistry } from './registry.js';
import { getAllNodes } from './utils.js';

eraserCommandRegistry.register('changeSetting', (params, document, services) => {
  const { nodeName, settingKey, settingValue } = params;
  const node = getAllNodes(document).find((n) => n.name === nodeName);

  if (!node?.$cstNode) {
    throw new Error('node not found');
  }

  const settings = node.settings || ([] as Array<CstNode & Setting>);

  const singleSettingText = `${settingKey}: ${settingValue}`;

  if (settings.length === 0) {
    // there are no settings, add brackets and all
    if (!settingValue) {
      return;
    }
    const space = node.$cstNode.text.endsWith(' \n') ? '' : ' ';
    return [
      {
        range: {
          start: node.$cstNode?.range.end,
          end: node.$cstNode?.range.end,
        },
        newText: `${space}[${singleSettingText}]`,
      },
    ];
  }

  const setting = settings.find((s) => s.key === settingKey) as CstNode & Setting;

  if (!setting && !settingValue) {
    return;
  }

  if (settingValue && setting?.$cstNode) {
    // this setting already exists, update it
    return [
      {
        range: setting.$cstNode.range,
        newText: singleSettingText,
      },
    ];
  }

  // this is a new setting and settings already exist. Add it to the end.
  if (settingValue) {
    const locationOfLastBracket = node.settings.at(-1)!.$cstNode!.range.end;
    return [
      {
        range: {
          start: locationOfLastBracket,
          end: locationOfLastBracket,
        },
        newText: `, ${singleSettingText}`,
      },
    ];
  }

  // this is removing an existing setting
  const isFirstSetting = settings.at(0)?.key === setting.key;

  // removing the only setting
  if (isFirstSetting && settings.length === 1) {
    const itemsToRemove: CstNode[] = [];
    for (let i = 0; i < node.$cstNode.content.length; i++) {
      const astNode = node.$cstNode.content[i].astNode;
      if ('key' in astNode && astNode.key === settingKey) {
        itemsToRemove.push(
          node.$cstNode.content[i - 1]!,
          node.$cstNode.content[i]!,
          node.$cstNode.content[i + 1]!
        );
        break;
      }
    }
    return [
      {
        range: {
          start: itemsToRemove[0].range.start,
          end: itemsToRemove[2].range.end,
        },
        newText: '',
      },
    ];
  }

  // if it's the first setting, remove the comma after
  // otherwise, remove the comma before
  let commaToRemove: CstNode | undefined;
  if (isFirstSetting) {
    commaToRemove = node.$cstNode.content.find((c) => c.text === ',')!;
    return [
      {
        range: {
          start: setting.$cstNode!.range.start,
          end: commaToRemove.range.end,
        },
        newText: '',
      },
    ];
  } else {
    for (let i = 0; i < node.$cstNode.content.length; i++) {
      const astNode = node.$cstNode.content[i].astNode;
      if ('key' in astNode && astNode.key === settingKey) {
        commaToRemove = node.$cstNode.content[i - 1]!;
        break;
      }
    }
  }
  if (!commaToRemove) {
    throw new Error('comma not found');
  }

  return [
    {
      range: {
        start: commaToRemove.range.start,
        end: setting.$cstNode!.range.end,
      },
      newText: '',
    },
  ];
});
