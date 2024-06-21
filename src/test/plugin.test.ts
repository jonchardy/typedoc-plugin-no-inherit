import { Application, DeclarationReflection, ReflectionKind, TSConfigReader } from "typedoc";
import { test, expect, describe, beforeAll } from "vitest";
import { load } from "../index.js";

let app: Application;

beforeAll(async () => {
  app = await Application.bootstrap(
    {
      entryPoints: ["src/testdata/basic.ts"],
    },
    [new TSConfigReader()]
  );
  load(app);
});

describe(`NoInheritPlugin`, () => {
  test("basic", async () => {
    const snapshot = app.options.snapshot();
    try {
      const project = (await app.convert())!;
      expect(project).toBeDefined();
  
      // WarmBlooded checks
      let refl = project.getChildByName("WarmBlooded") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Interface);
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("generateHeat")).toBeDefined();
  
      // ColdBlooded checks
      refl = project.getChildByName("ColdBlooded") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Interface);
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("absorbHeat")).toBeDefined();
  
      // Mammal checks
      refl = project.getChildByName("Mammal") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("hairType")).toBeDefined();
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("generateHeat")).toBeDefined();
  
      // Reptile checks
      refl = project.getChildByName("Reptile") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeDefined();
      expect(refl?.getChildByName("move")).toBeDefined();
      expect(refl?.getChildByName("skinType")).toBeDefined();
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("absorbHeat")).toBeDefined();
      let childRefl = refl?.getChildByName("pumpBlood");
      expect(childRefl?.comment).toBeUndefined();  // pumpBlood no comment since ColdBlooded didn't inherit it
  
      // Dog checks
      refl = project.getChildByName("Dog") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("hairType")).toBeDefined();
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("generateHeat")).toBeDefined();
      expect(refl?.getChildByName("breed")).toBeDefined();
      expect(refl?.getChildByName("bark")).toBeDefined();
  
      // Crocodile checks
      refl = project.getChildByName("Crocodile") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("skinType")).toBeUndefined();
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("absorbHeat")).toBeUndefined();
      expect(refl?.getChildByName("stealthAttack")).toBeDefined();
  
      // SubErrorA checks
      refl = project.getChildByName("SubErrorA") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeUndefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeUndefined();
      expect(refl?.getChildByName("propA")).toBeDefined();
  
      // SubErrorB checks
      refl = project.getChildByName("SubErrorB") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeUndefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeUndefined();
      expect(refl?.getChildByName("propA")).toBeDefined();
      expect(refl?.getChildByName("propB")).toBeDefined();
  
      // SubErrorC checks
      refl = project.getChildByName("SubErrorC") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeDefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeDefined();
      expect(refl?.getChildByName("propC")).toBeDefined();
    } finally {
      app.options.restore(snapshot);
    }
  });

  test("basic inheritNone", async () => {
    const snapshot = app.options.snapshot();
    try {
      app.options.setValue("inheritNone", true);

      const project = (await app.convert())!;
      expect(project).toBeDefined();
      
      // WarmBlooded checks
      let refl = project.getChildByName("WarmBlooded") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Interface);
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("generateHeat")).toBeDefined();
  
      // ColdBlooded checks
      refl = project.getChildByName("ColdBlooded") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Interface);
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("absorbHeat")).toBeDefined();
  
      // Mammal checks
      refl = project.getChildByName("Mammal") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("hairType")).toBeDefined();
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("generateHeat")).toBeDefined();
  
      // Reptile checks
      refl = project.getChildByName("Reptile") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("skinType")).toBeDefined();
      expect(refl?.getChildByName("pumpBlood")).toBeDefined();
      expect(refl?.getChildByName("absorbHeat")).toBeDefined();
      let childRefl = refl?.getChildByName("pumpBlood");
      expect(childRefl?.comment).toBeUndefined();  // pumpBlood no comment since ColdBlooded didn't inherit it
  
      // Dog checks
      refl = project.getChildByName("Dog") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("hairType")).toBeUndefined();
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("generateHeat")).toBeUndefined();
      expect(refl?.getChildByName("breed")).toBeDefined();
      expect(refl?.getChildByName("bark")).toBeDefined();
  
      // Crocodile checks
      refl = project.getChildByName("Crocodile") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("name")).toBeUndefined();
      expect(refl?.getChildByName("move")).toBeUndefined();
      expect(refl?.getChildByName("skinType")).toBeUndefined();
      expect(refl?.getChildByName("pumpBlood")).toBeUndefined();
      expect(refl?.getChildByName("absorbHeat")).toBeUndefined();
      expect(refl?.getChildByName("stealthAttack")).toBeDefined();
  
      // SubErrorA checks
      refl = project.getChildByName("SubErrorA") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeUndefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeUndefined();
      expect(refl?.getChildByName("propA")).toBeDefined();
  
      // SubErrorB checks
      refl = project.getChildByName("SubErrorB") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeUndefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeUndefined();
      expect(refl?.getChildByName("propA")).toBeUndefined();
      expect(refl?.getChildByName("propB")).toBeDefined();
  
      // SubErrorC checks
      refl = project.getChildByName("SubErrorC") as DeclarationReflection;
      expect(refl.kind).toBe(ReflectionKind.Class);
      expect(refl?.getChildByName("message")).toBeUndefined();
      expect(refl?.getChildByName("captureStackTrace")).toBeUndefined();
      expect(refl?.getChildByName("propC")).toBeDefined();
    } finally {
      app.options.restore(snapshot);
    }
  });
});
