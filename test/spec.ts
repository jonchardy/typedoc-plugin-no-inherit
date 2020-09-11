import * as fs from 'fs-extra';
import * as path from 'path';
import { ModuleResolutionKind } from 'typescript';
import * as TypeDoc from 'typedoc';

describe(`NoInheritPlugin`, () => {
  const outDir = path.join(__dirname, 'out');
  const specDir = path.join(__dirname, 'specs');

  let app: TypeDoc.Application;
  let project: TypeDoc.ProjectReflection;

  beforeAll(() => {
    fs.removeSync(outDir);
    app = new TypeDoc.Application();
    app.bootstrap({
      moduleResolution: ModuleResolutionKind.NodeJs,
      plugin: [path.join(__dirname, '../dist/index')]
    });

    project = app.convert(app.expandInputFiles(['./test/src/']));
  });

  afterAll(() => {
    fs.removeSync(outDir);
  });

  /**
   * Run Typedoc on some source files and just generate the HTML output for inspection.
   */
  describe(`Output HTML`, () => {
    test('HTML index exists', async () => {
      await app.generateDocs(project, outDir);
      expect(fs.existsSync(`${outDir}/index.html`)).toBeTruthy();
    });
  });
  
  /**
   * Run Typedoc on some source files and ensure the output matches the expected spec.
   */
  describe(`Output JSON`, () => {
    const outPath = `${outDir}/basic.json`;
    const specPath = `${specDir}/basic.json`;

    test('JSON output matches spec', async () => {
      await app.generateJson(project, outPath);
      const fixture = JSON.parse(fs.readFileSync(outPath, 'utf-8').toString());
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8').toString());
      expect(fixture).toEqual(spec);
    });
  });
});
