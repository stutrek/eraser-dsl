import { CompositeCstNode, LangiumDocument } from 'langium';
import { Model, NodeDeclaration } from '../generated/ast.js';

export function getAllNodes(document: LangiumDocument<Model>) {
  const nodes: Array<PlusCompositeCstNode<NodeDeclaration>> = [];
  document.precomputedScopes?.forEach((scope) => {
    if (scope.node) {
      nodes.push(scope.node as PlusCompositeCstNode<NodeDeclaration>);
    }
  });
  return nodes;
}

export type PlusCompositeCstNode<T> = T & { $cstNode: CompositeCstNode };
