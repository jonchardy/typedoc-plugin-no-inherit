import { Reflection, ReflectionKind, DeclarationReflection } from 'typedoc/dist/lib/models/reflections/index';
import { Component, ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { Context } from 'typedoc/dist/lib/converter/context';
import { CommentPlugin } from 'typedoc/dist/lib/converter/plugins/CommentPlugin';

/**
 * A handler that deals with inherited reflections.
 */
@Component({name: 'no-inherit'})
export class NoInheritPlugin extends ConverterComponent {
    /**
     * A list of classes/interfaces that don't inherit reflections.
     */
    private noInherit: DeclarationReflection[];

    /**
     * Create a new CommentPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, {
            [Converter.EVENT_BEGIN]: this.onBegin,
            [Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
            [Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve
        });
    }

    /**
     * Triggered when the converter begins converting a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBegin(context: Context) {
      this.noInherit = [];
  }

    /**
     * Triggered when the converter has created a declaration or signature reflection.
     *
     * Add to the list of classes/interfaces that don't inherit docs.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     * @param node  The node that is currently processed if available.
     */
    private onDeclaration(context: Context, reflection: Reflection, node?) {
        // only if it's a DeclarationReflection and has a comment with @noinheritdoc tag
        if (!(node && reflection instanceof DeclarationReflection &&
              reflection.kindOf(ReflectionKind.ClassOrInterface) &&
              reflection.comment && reflection.comment.hasTag('noinheritdoc'))) {
            return;
        }

        this.noInherit.push(reflection);
        CommentPlugin.removeTags(reflection.comment, 'noinheritdoc');
    }

    /**
     * Triggered when the converter begins resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBeginResolve(context: Context) {
        if (this.noInherit) {
            this.noInherit.forEach((reflection: DeclarationReflection) => {
              reflection.children.forEach((child: Reflection) => {
                if (child instanceof DeclarationReflection && child.inheritedFrom &&
                    (!child.overwrites || (child.overwrites && child.overwrites !== child.inheritedFrom))) {
                  CommentPlugin.removeReflection(context.project, child);
                }
              });
            });
        }
    }
}
