import { Application, ParameterType } from 'typedoc';
import { NoInheritPlugin, NoInheritPluginOptions } from './plugin';

declare module "typedoc" {
  export interface TypeDocOptionMap extends NoInheritPluginOptions {}
}

export function load(app: Application) {
  app.options.addDeclaration({
    name: "alwaysOmitInheritance",
    defaultValue: false,
    help: "[typedoc-plugin-no-inherit]: Whether to treat all declarations as having the '@noInheritDoc' tag.",
    type: ParameterType.Boolean,
  });
  new NoInheritPlugin({
    alwaysOmitInheritance: app.options.getValue("alwaysOmitInheritance"),
  }).initialize(app);
}