import { Application, Context, Converter, DeclarationReflection, ParameterType, ReferenceType, Reflection, ReflectionKind, Type } from "typedoc";

declare module "typedoc" {
  export interface TypeDocOptionMap {
    inheritNone: boolean;
  }
}

export function load(app: Application) {
  app.options.addDeclaration({
    name: "inheritNone",
    defaultValue: false,
    help: "[typedoc-plugin-no-inherit]: If true, no documentation will be inherited regardless of tags.",
    type: ParameterType.Boolean,
  });

  const noInherit: DeclarationReflection[] = [];
  const inheritedReflections: DeclarationReflection[] = [];

  /**
   * Builds the list of classes/interfaces that don't inherit docs and
   * the list of reflections that are inherited that could end up being removed.
   */
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context: Context, reflection: Reflection) => {
      if (reflection instanceof DeclarationReflection) {
        // class or interface that won't inherit docs
        if (reflection.kindOf(ReflectionKind.ClassOrInterface) && reflection.comment && reflection.comment.getTag("@noInheritDoc")) {
          if (!app.options.getValue("inheritNone")) noInherit.push(reflection);
          reflection.comment.removeTags("@noInheritDoc");
        }
        // class or interface member inherited from a super
        if (
          reflection.inheritedFrom &&
          reflection.parent &&
          reflection.parent.kindOf(ReflectionKind.ClassOrInterface) &&
          (!reflection.overwrites || (reflection.overwrites && reflection.overwrites !== reflection.inheritedFrom))
        ) {
          if (app.options.getValue("inheritNone")) context.project.removeReflection(reflection); // inheritNone? just remove it immediately
          else inheritedReflections.push(reflection);
        }
      }
    },
    null,
    -1100
  );

  /**
   * Goes over the list of inherited reflections and removes any that are down the hierarchy
   * from a class that doesn't inherit docs.
   */
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    /**
     * Checks whether some DeclarationReflection is in the noInherit list.
     * @param search  The DeclarationReflection to search for in the list.
     */
    function isNoInherit(search: DeclarationReflection): boolean {
      if (noInherit.find((no: DeclarationReflection) => no.id === search.id && no.name === search.name)) {
        return true;
      }
      return false;
    }

    /**
     * Checks whether some Reflection is in the inheritedReflections list.
     * @param search  The Reflection to search for in the list.
     */
    function isInherited(search: Reflection): boolean {
      if (inheritedReflections.find((inh: Reflection) => inh.id === search.id && inh.name === search.name)) {
        return true;
      }
      return false;
    }

    /**
     * Checks whether some reflection's inheritance chain is broken by a class or interface that doesn't inherit docs.
     * @param context  The context object describing the current state the converter is in.
     * @param current  The current reflection being evaluated for non-inheritance.
     * @param depth  The current recursion depth, used for stopping on excessively long inheritance chains.
     */
    function isNoInheritRecursive(context: Context, current: Reflection, depth: number): boolean {
      if (depth > 20) {
        app.logger.warn(`Found inheritance chain with depth > 20, stopping no inherit check: ${current.getFullName()}`);
        return false; // stop if we've recursed more than 20 times
      }

      // As we move up the chain, check if the reflection parent is in the noInherit list
      const parent = current.parent as DeclarationReflection;
      if (!parent) return false;
      if (isNoInherit(parent) && (depth === 0 || isInherited(current))) {
        return true;
      }

      const checkExtended = (type: Type) => {
        const extended = (type as ReferenceType)?.reflection;
        if (extended instanceof Reflection) {
          const upLevel = extended.getChildByName(current.name);
          if (upLevel && isNoInheritRecursive(context, upLevel, depth + 1)) {
            return true;
          }
        }
        return false;
      };

      if (parent.extendedTypes) {
        if (parent.extendedTypes.some(checkExtended)) {
          return true;
        }
      }

      return false;
    }

    if (noInherit.length > 0 && inheritedReflections.length > 0) {
      const project = context.project;
      const removals: DeclarationReflection[] = [];

      for (const reflection of inheritedReflections) {
        // Look through the inheritance chain for a reflection that is flagged as noInherit for this reflection
        if (isNoInheritRecursive(context, reflection, 0)) {
          removals.push(reflection);
        }
      }

      for (const removal of removals) {
        project.removeReflection(removal);
      }
    }
  });
}
