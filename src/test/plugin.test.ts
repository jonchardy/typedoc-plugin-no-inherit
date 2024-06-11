import { Application, DeclarationReflection, ReflectionKind, TSConfigReader } from "typedoc";
import { test, expect, beforeEach, describe } from "vitest";
import { load } from "../index.js";

describe(`NoInheritPlugin`, () => {
  test("basic", async () => {
    const app = await Application.bootstrap(
      {
        entryPoints: ["src/testdata/basic.ts"],
      },
      [new TSConfigReader()]
    );
    load(app);
    const project = (await app.convert())!;
    expect(project).toBeDefined();
    let refl = project.getChildByName("Mammal") as DeclarationReflection;
    expect(refl.kind).toBe(ReflectionKind.Class);
    expect(refl?.getChildByName("move")).toBeUndefined();
  });

  test("basic inheritNone", async () => {
    const app = await Application.bootstrap(
      {
        entryPoints: ["src/testdata/basic.ts"],
      },
      [new TSConfigReader()]
    );
    load(app);
    app.options.setValue("inheritNone", true);
    const project = (await app.convert())!;
    expect(project).toBeDefined();
    let refl = project.getChildByName("Mammal");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    expect(refl?.getChildByName("move")).toBeUndefined();
  });
});
