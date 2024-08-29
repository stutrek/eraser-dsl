import { AstNode, CstNode, DefaultNameProvider } from 'langium';
import {
  isErdConnectionTarget,
  isErdConnection,
  isFieldDefinition,
  isErdConnectionFieldName,
} from '../generated/ast.js';

// https://github.com/eclipse-langium/langium/discussions/1615
export class ErdNameProvider extends DefaultNameProvider {
  getName(node: AstNode): string | undefined {
    if (isErdConnectionFieldName(node)) {
      // console.log(
      //   'isErdConnectionFieldName',
      //   node.$container.table.$refText + '.' + node.field.$refText
      // );
      return node.$container.table.table.$refText + '.' + node.field.$refText;
    }
    if (isFieldDefinition(node)) {
      // console.log('isFieldDefinition', node.$container.name + '.' + node.name);
      return node.$container.name + '.' + node.name;
    } else {
      return super.getName(node);
    }
  }

  getNameNode(node: AstNode): CstNode | undefined {
    console.log('getNameNode', node);
    if (isErdConnectionFieldName(node)) {
      console.log('hi');
    }
    // if (isErdConnectionFieldName(node)) {
    //   // console.log('isErdConnectionFieldName', node);
    //   return node.field.$refNode;
    // } else if (isErdConnection(node) || isErdConnectionTarget(node)) {
    //   return node.table.table.$refNode;
    // } else {
    return super.getNameNode(node);
    // }
  }
}
