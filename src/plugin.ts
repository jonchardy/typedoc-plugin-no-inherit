import { Reflection, ReflectionKind, DeclarationReflection } from 'typedoc/dist/lib/models/reflections/index';
import { Component, ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { Context } from 'typedoc/dist/lib/converter/context';
import { CommentPlugin } from 'typedoc/dist/lib/converter/plugins/CommentPlugin';
import { Type, ReferenceType } from 'typedoc/dist/lib/models';

/**
 * A handler that deals with inherited reflections.
 */
@Component({ name: 'no-inherit' })
export class NoInheritPlugin extends ConverterComponent {
  /**
   * A list of classes/interfaces that don't inherit reflections.
   */
  private noInherit: DeclarationReflection[];

  /**
   * A list of reflections that are inherited from a super.
   */
  private inheritedReflections: DeclarationReflection[];

  /**
   * Create a new CommentPlugin instance.
   */
  initialize() {
    this.listenTo(this.owner, Converter.EVENT_BEGIN, this.onBegin);
    this.listenTo(this.owner, Converter.EVENT_CREATE_DECLARATION, this.onDeclaration, -100); // after CommentPlugin
    this.listenTo(this.owner, Converter.EVENT_RESOLVE_BEGIN, this.onBeginResolve);
  }

  /**
   * Triggered when the converter begins converting a project.
   *
   * @param context  The context object describing the current state the converter is in.
   */
  private onBegin(context: Context) {
    this.noInherit = [];
    this.inheritedReflections = [];
  }

  /**
   * Triggered when the converter has created a declaration or signature reflection.
   *
   * Builds the list of classes/interfaces that don't inherit docs and
   * the list of reflections that are inherited that could end up being removed.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently processed.
   * @param node  The node that is currently processed if available.
   */
  private onDeclaration(context: Context, reflection: Reflection, node?) {
    if (reflection instanceof DeclarationReflection) {
      // class or interface that won't inherit docs
      if (reflection.kindOf(ReflectionKind.ClassOrInterface) &&
          reflection.comment && reflection.comment.hasTag('noinheritdoc')) {
        this.noInherit.push(reflection);
        CommentPlugin.removeTags(reflection.comment, 'noinheritdoc');
      }
      // class or interface member inherited from a super
      if (reflection.inheritedFrom && reflection.parent && reflection.parent.kindOf(ReflectionKind.ClassOrInterface) &&
          (!reflection.overwrites || (reflection.overwrites && reflection.overwrites !== reflection.inheritedFrom))) {
        this.inheritedReflections.push(reflection);
      }
    }
  }

  /**
   * Triggered when the converter begins resolving a project.
   *
   * Goes over the list of inherited reflections and removes any that are down the hierarchy
   * from a class that doesn't inherit docs.
   *
   * @param context The context object describing the current state the converter is in.
   */
  private onBeginResolve(context: Context) {
    if (this.noInherit) {
      const project = context.project;
      const removals = [];

      this.inheritedReflections.forEach((reflection) => {
        const resolvedInherit = this.resolveType(context, reflection, reflection.inheritedFrom);
        // Look up the inheritance chain for a super that doesn't inherit this reflection
        if (resolvedInherit instanceof Reflection && this.isNoInheritUpHierarchy(context, reflection, resolvedInherit, 0)) {
          removals.push(reflection);
        }
      });

      removals.forEach((removal) => {
        CommentPlugin.removeReflection(project, removal);
      })
    }
  }

  /**
   * Takes some ReferenceType and resolve it to a reflection.
   * This is needed because we are operating prior to the TypePlugin resolving types.
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection context.
   * @param type  The type to find relative to the reflection.
   */
  private resolveType(context: Context, reflection: Reflection, type: Type): Reflection {
    const project = context.project;
    if (type instanceof ReferenceType) {
      if (type.symbolID === ReferenceType.SYMBOL_ID_RESOLVE_BY_NAME) {
        return reflection.findReflectionByName(type.name);
      } else if (!type.reflection && type.symbolID !== ReferenceType.SYMBOL_ID_RESOLVED) {
        return project.reflections[project.symbolMapping[type.symbolID]];
      } else {
        return type.reflection;
      }
    }
    return null;
  }

  /**
   * Checks whether some reflection's inheritance chain is broken by a class or interface that doesn't inherit docs.
   * @param context  The context object describing the current state the converter is in.
   * @param current  The current reflection being evaluated for non-inheritance.
   * @param end  The end of the inheritance chain.
   * @param depth  The current recursion depth, used for stopping on excessively long inheritance chains.
   */
  private isNoInheritUpHierarchy(context: Context, current: Reflection, end: Reflection, depth: number): boolean {
    if (depth > 20) {
      this.application.logger.warn(`Found inheritance chain with depth > 20, stopping no inherit check: ${end.getFullName()}`);
      return false; // stop if we've recursed more than 20 times
    }
    if (current === end) return false;

    // As we move up the chain, check if the reflection parent is in the noInherit list
    const parent = current.parent as DeclarationReflection;
    if (!parent) return false;

    for (let i = 0; i < this.noInherit.length; i++) {
      const no = this.noInherit[i];
      if (no.id === parent.id && no.name === parent.name) {
        return true;
      }
    }

    if (parent.extendedTypes) {
      for (let i = 0; i < parent.extendedTypes.length; i++) {
        const extended = this.resolveType(context, parent, parent.extendedTypes[i]);
        if (extended instanceof Reflection) {
          const upLevel = extended.findReflectionByName(current.name);
          if (this.isNoInheritUpHierarchy(context, upLevel, end, depth + 1)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
