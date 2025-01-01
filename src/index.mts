import { Application } from 'typedoc';
import { NoInheritPlugin } from './plugin.mjs';

export function load(app: Application) {
  new NoInheritPlugin().initialize(app);
}