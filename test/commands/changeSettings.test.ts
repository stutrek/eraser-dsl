import { beforeAll, describe, expect, test } from 'vitest';
import { setupCommandTest } from './testUtils.js';

let makeCommandContext: ReturnType<typeof setupCommandTest>['makeCommandContext'];

beforeAll(async () => {
  ({ makeCommandContext } = setupCommandTest());
});

describe('changeSettings', () => {
  test('changes a setting on a node', async () => {
    const { executeCommand } = await makeCommandContext(`users [icon: user, color: yelow]`);

    const updatedTextDocument = await executeCommand('changeSetting', {
      nodeName: 'users',
      settingKey: 'icon',
      settingValue: 'monitor',
    });

    expect(updatedTextDocument.getText()).toBe(`users [icon: monitor, color: yelow]`);
  });
});
