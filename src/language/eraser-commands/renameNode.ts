import { eraserCommandRegistry } from './registry.js';
import { getAllNodes } from './utils.js';

eraserCommandRegistry.register('changeNodeName', async (params, document, services) => {
  const { oldName, newName } = params;
  const node = getAllNodes(document).find((n) => n.name === oldName);

  if (!node || !node.$cstNode) {
    return;
  }

  const renameParams = {
    position: node.$cstNode.range.start,
    textDocument: { uri: document.uri.toString() },
    newName,
  };
  // @ts-ignore
  return await services.lsp.RenameProvider.rename(document, renameParams);
});
