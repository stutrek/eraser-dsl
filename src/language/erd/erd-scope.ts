import {
  ReferenceInfo,
  Scope,
  DefaultScopeProvider,
  EMPTY_SCOPE,
  DefaultScopeComputation,
  LangiumDocument,
  PrecomputedScopes,
  AstNode,
  AstUtils,
} from 'langium';
import { isErdFieldReference, isErdTableReference, isTableDeclaration } from '../generated/ast.js';

export class ErdScopeProvider extends DefaultScopeProvider {
  getScope(context: ReferenceInfo): Scope {
    if (context.property === 'field' && isErdFieldReference(context.container)) {
      const container = context.container.$container;
      const table = container.table.table.ref;
      if (isTableDeclaration(table)) {
        return this.createScopeForNodes(table.fields);
      } else if (isErdTableReference(table)) {
        return this.createScopeForNodes([context.container]);
      }
      return EMPTY_SCOPE;
    }
    return super.getScope(context);
    // const scopes: Array<Stream<AstNodeDescription>> = [];
    // const referenceType = this.reflection.getReferenceType(context);

    // const precomputed = AstUtils.getDocument(context.container).precomputedScopes;

    // if (precomputed) {
    //   const nodeDescriptions: AstNodeDescription[] = [];
    //   const found = new Set<string>();
    //   for (const [node, nodeDescription] of precomputed) {
    //     const name = isFieldDefinition(node)
    //       ? node.$container.name + '.' + nodeDescription.name
    //       : nodeDescription.name;
    //     if (!found.has(name)) {
    //       nodeDescriptions.push(nodeDescription);
    //       found.add(name);
    //     }
    //   }
    //   scopes.push(stream(nodeDescriptions));
    // }

    // let result: Scope = this.getGlobalScope(referenceType, context);
    // for (let i = scopes.length - 1; i >= 0; i--) {
    //   result = this.createScope(scopes[i], result);
    // }
    // return result;
  }
}

export class ErdScopeComputation extends DefaultScopeComputation {
  protected override processNode(node: AstNode, document: LangiumDocument, scopes: PrecomputedScopes): void {
    const container = AstUtils.findRootNode(node);
    if (container) {
      const name = this.nameProvider.getName(node);
      if (name) {
        scopes.add(container, this.descriptions.createDescription(node, name, document));
      }
    }
  }
}