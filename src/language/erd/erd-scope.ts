import {
  ReferenceInfo,
  Scope,
  AstUtils,
  Stream,
  AstNodeDescription,
  stream,
  DefaultScopeProvider,
  EMPTY_SCOPE,
} from 'langium';
import { ErdConnection, ErdConnectionTarget, isFieldDefinition } from '../generated/ast.js';

export class ErdScopeProvider extends DefaultScopeProvider {
  getScope(context: ReferenceInfo): Scope {
    if (context.property === 'field') {
      const container = context.container.$container as ErdConnectionTarget | ErdConnection;
      const table = container.ref.table;
      if (table) {
        return this.createScopeForNodes(table.fields);
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
