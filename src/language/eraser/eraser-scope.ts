import {
  ReferenceInfo,
  Scope,
  AstUtils,
  Stream,
  AstNodeDescription,
  stream,
  DefaultScopeProvider,
} from 'langium';

export class EraserScopeProvider extends DefaultScopeProvider {
  getScope(context: ReferenceInfo): Scope {
    const scopes: Array<Stream<AstNodeDescription>> = [];
    const referenceType = this.reflection.getReferenceType(context);

    const precomputed = AstUtils.getDocument(context.container).precomputedScopes;

    if (precomputed) {
      const found = new Map<string, AstNodeDescription>();
      for (const [_node, nodeDescription] of precomputed) {
        if (
          nodeDescription.type === 'NodeDeclaration' ||
          found.has(nodeDescription.name) === false
        ) {
          found.set(nodeDescription.name, nodeDescription);
        }
      }
      scopes.push(stream(found.values()));
    }

    let result: Scope = this.getGlobalScope(referenceType, context);
    for (let i = scopes.length - 1; i >= 0; i--) {
      result = this.createScope(scopes[i], result);
    }
    return result;
  }
}
