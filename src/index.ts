import { Application } from 'typedoc/dist/lib/application';
import { NoInheritPlugin } from './NoInheritPlugin';

module.exports = (PluginHost: Application) => {
  const app = PluginHost.owner;
  app.converter.addComponent('no-inherit', NoInheritPlugin);
}