module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        lib: ['ES2015']
      }
    }
  },
  testRegex: '(/__tests__/.*|(spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
}