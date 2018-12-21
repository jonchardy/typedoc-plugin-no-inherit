import * as fs from 'fs';
import { Application } from 'typedoc/dist/lib/application';

const srcDir = 'test/src';
const outDir = 'test/out';
const specDir = 'test/specs';
const app = new Application();

describe(`Output typedoc documentation`, async () => {
  const srcPath = [`${srcDir}/basic.ts`];
  const outPath = `${outDir}/basic.json`;
  const specPath = `${specDir}/basic.json`;

  outputHtml(srcPath, outDir);
  compareAgainstSpec(srcPath, outPath, specPath);
});

/**
 * Run Typedoc on some source files and just generate the HTML output for inspection.
 * @param src a list of source files to be compiled and converted with Typedoc
 * @param outPath the path and file name of the target file for Typedoc
 */
function outputHtml(src: string[], outDir) {
  app.generateDocs(src, outDir);
}

/**
 * Run Typedoc on some source files and ensure the output matches the expected spec.
 * @param src a list of source files to be compiled and converted with Typedoc
 * @param outPath the path and file name of the target file for Typedoc
 * @param specPath the path and file name of the spec file to compare against
 */
function compareAgainstSpec(src: string[], outPath, specPath) {
  test('matches spec', async () => {
    await app.generateJson(src, outPath);
    const fixture = JSON.parse(fs.readFileSync(outPath, 'utf-8').toString());
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8').toString());
    expect(fixture).toEqual(spec);
  });
}
