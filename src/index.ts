import { Application } from 'typedoc/dist/lib/application';
import { NoInheritPlugin } from './plugin';

export = (PluginHost: Application) => {
  const app = PluginHost.owner;
  app.converter.addComponent('no-inherit', new NoInheritPlugin(app.converter));
}