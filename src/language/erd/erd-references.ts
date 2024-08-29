import {
  AstNode,
  DefaultReferences,
  FindReferencesOptions,
  ReferenceDescription,
  stream,
  // stream,
  Stream,
  UriUtils,
  // UriUtils,
} from 'langium';

export class ErdReferences extends DefaultReferences {
  findReferences(
    targetNode: AstNode,
    options: FindReferencesOptions
  ): Stream<ReferenceDescription> {
    // console.log('findReferences', targetNode, options);
    const refs: ReferenceDescription[] = [];
    if (options.includeDeclaration) {
      const ref = this.getReferenceToSelf(targetNode);
      if (ref) {
        refs.push(ref);
      }
    }
    let indexReferences = this.index.findAllReferences(
      targetNode,
      this.nodeLocator.getAstNodePath(targetNode)
    );
    if (options.documentUri) {
      indexReferences = indexReferences.filter((ref) =>
        UriUtils.equals(ref.sourceUri, options.documentUri)
      );
    }
    const filtered = indexReferences.filter((ref) => ref.segment.offset !== refs[0].segment.offset);
    refs.push(...filtered);
    return stream(refs);
  }
}
