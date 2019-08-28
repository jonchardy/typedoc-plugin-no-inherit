import { Application } from 'typedoc/dist/lib/application';
import { NoInheritPlugin } from './plugin';

module.exports = (PluginHost: Application) => {
  const app = PluginHost.owner;
  app.converter.addComponent('no-inherit', new NoInheritPlugin(app.converter));
}