import { AstNode, CstNode, DefaultNameProvider } from 'langium';
import { isErdFieldReference, isErdTableReference } from '../generated/ast.js';

// https://github.com/eclipse-langium/langium/discussions/1615
export class ErdNameProvider extends DefaultNameProvider {
  getName(node: AstNode): string | undefined {
    if (isErdFieldReference(node)) {
      return node.field.$refText;
    }
    if (isErdTableReference(node)) {
      return node.table.$refText;
    } else {
      return super.getName(node);
    }
  }

  getNameNode(node: AstNode): CstNode | undefined {
    if (isErdFieldReference(node)) {
      return node.field.$refNode;
    } else if (isErdTableReference(node)) {
      return node.table.$refNode;
    }
    return super.getNameNode(node);
  }
}
