import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {
  Connection,
  ConnectionTarget,
  EraserAstType,
  NodeDeclaration,
  Setting,
} from '../generated/ast.js';
import type { EraserServices } from './eraser-module.js';

/**
 * Register custom validation checks.
 */
export function registerEraserValidationChecks(services: EraserServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.EraserValidator;
  const checks: ValidationChecks<EraserAstType> = {
    NodeDeclaration: validator.checkNodeName,
    Setting: validator.checkSettingKey,
    Connection: validator.checkConnection,
    ConnectionTarget: validator.checkConnection,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class EraserValidator {
  checkNodeName(node: NodeDeclaration, accept: ValidationAcceptor): void {
    if (node.name) {
      if (/[^a-zA-Z0-9- ?]/.test(node.name)) {
        accept('error', 'Node name can be alphanumeric, hyphen, or ?', { node, property: 'name' });
      }
    }
  }
  checkConnection(node: Connection | ConnectionTarget, accept: ValidationAcceptor): void {
    if (node.node.$refText) {
      if (/[^a-zA-Z0-9- ?]/.test(node.node.$refText)) {
        accept('error', 'Node name can be alphanumeric, hyphen, or ?', { node });
      }
    }
  }
  checkSettingKey(setting: Setting, accept: ValidationAcceptor): void {
    if (
      setting.key &&
      /icon|label|color|colorMode|styleMode|typeface|shape/.test(setting.key) !== true
    ) {
      accept('error', 'Unknown setting', { node: setting, property: 'key' });
    }
  }
}
