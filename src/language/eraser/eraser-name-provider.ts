import { AstNode, CstNode, DefaultNameProvider } from 'langium';
import { isConnection, isConnectionTarget } from '../generated/ast.js';

// https://github.com/eclipse-langium/langium/discussions/1615
export class EraserNameProvider extends DefaultNameProvider {
  getName(node: AstNode): string | undefined {
    if (isConnection(node) || isConnectionTarget(node)) {
      return node.node.$refText; // Use the reference text as the name of the node
    } else {
      return super.getName(node);
    }
  }

  getNameNode(node: AstNode): CstNode | undefined {
    if (isConnection(node) || isConnectionTarget(node)) {
      return node.node.$refNode;
    } else {
      return super.getNameNode(node);
    }
  }
}
