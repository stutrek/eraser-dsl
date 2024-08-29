import { inject } from 'langium';
import { createDefaultModule, createDefaultSharedModule } from 'langium/lsp';
import type { DefaultSharedModuleContext, LangiumSharedServices } from 'langium/lsp';
import {
  EraserDslGeneratedModule,
  EraserErdGeneratedModule,
  EraserGeneratedSharedModule,
} from './generated/module.js';
import { ErdModule, ErdServices } from './erd/erd-module.js';
import { EraserModule, EraserServices } from './eraser/eraser-module.js';
import { registerEraserValidationChecks } from './eraser/eraser-validator.js';

export function createAllServices(
  context: DefaultSharedModuleContext
): {
  shared: LangiumSharedServices;
  Erd: ErdServices;
  Eraser: EraserServices;
} {
  const shared = inject(createDefaultSharedModule(context), EraserGeneratedSharedModule);
  const Erd = inject(createDefaultModule({ shared }), EraserErdGeneratedModule, ErdModule);
  shared.ServiceRegistry.register(Erd);
  const Eraser = inject(createDefaultModule({ shared }), EraserDslGeneratedModule, EraserModule);
  shared.ServiceRegistry.register(Eraser);
  registerEraserValidationChecks(Eraser);

  if (!context.connection) {
    // We don't run inside a language server
    // Therefore, initialize the configuration provider instantly
    shared.workspace.ConfigurationProvider.initialized({});
  }

  return {
    shared,
    Erd,
    Eraser,
  };
}
