import * as fs from 'fs-extra';
import * as path from 'path';
import {
  Application,
  ArgumentsReader,
  ProjectReflection,
  Options,
  TSConfigReader,
  TypeDocReader
} from 'typedoc';

describe(`NoInheritPlugin`, () => {
  const outDir = path.join(__dirname, 'out');
  const specDir = path.join(__dirname, 'specs');

  function setup(optionsMap?: Record<string, unknown>) {
    fs.removeSync(outDir);

    const app = new Application();
    app.options.addReader(new ArgumentsReader(0));
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());

    app.bootstrap({
      entryPoints: [path.join(__dirname, 'src', 'basic.ts')],
      plugin: [path.join(__dirname, '../dist/index')],
      tsconfig: path.join(__dirname, 'tsconfig.json'),
    });

    const argumentsReader = new ArgumentsReader(300);

    if (optionsMap) {
      const options = new Options(app.logger);

      for (const [name, value] of Object.entries(optionsMap)) {
        options.setValue(name, value)
      }

      argumentsReader.read(options, app.logger);
    }

    app.options.addReader(argumentsReader);

    const project = app.convert()!;

    return { app, project };
  }

  afterEach(() => {
    // fs.removeSync(outDir);
  });

  /**
   * Run Typedoc on some source files and just generate the HTML output for inspection.
   */
  describe(`Output HTML`, () => {
    test('HTML index exists', async () => {
      const { app, project } = setup();

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
      const { app, project } = setup();

      await app.generateJson(project, outPath);
      const fixture = JSON.parse(fs.readFileSync(outPath, 'utf-8').toString());
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8').toString());
      expect(fixture).toEqual(spec);
    });
  });

  describe.only(`options`, () => {
    describe.only('alwaysOmitInheritance', () => {
      const outPath = path.join(outDir, `/options-alwaysOmitInheritance.json`);
      const specPath = path.join(
        specDir,
        `/options-alwaysOmitInheritance.json`
      );

      test.only('JSON output matches spec', async () => {
        const { app, project } = setup({ alwaysOmitInheritance: true, });

        await app.generateJson(project, outPath);
        const fixture = JSON.parse(
          fs.readFileSync(outPath, 'utf-8').toString()
        );
        const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8').toString());
        expect(fixture).toEqual(spec);
      });
    });
  });
});
