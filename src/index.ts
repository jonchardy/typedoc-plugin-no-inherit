import { Application } from 'typedoc';
import { NoInheritPlugin } from './plugin';

export function load(app: Application) {
  new NoInheritPlugin().initialize(app);
}