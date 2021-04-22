import * as fs from 'fs-extra';
import * as path from 'path';
import {
  Application,
  ArgumentsReader,
  ProjectReflection,
  TSConfigReader,
  TypeDocReader
} from 'typedoc';

describe(`NoInheritPlugin`, () => {
  const outDir = path.join(__dirname, 'out');
  const specDir = path.join(__dirname, 'specs');

  let app: Application;
  let project: ProjectReflection;

  beforeAll(() => {
    fs.removeSync(outDir);
    app = new Application();
    app.options.addReader(new ArgumentsReader(0));
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());
    app.options.addReader(new ArgumentsReader(300));

    app.bootstrap({
      entryPoints: [path.join(__dirname, 'src', 'basic.ts')],
      plugin: [path.join(__dirname, '../dist/index')],
      tsconfig: path.join(__dirname, 'tsconfig.json')
    });

    project = app.convert();
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
