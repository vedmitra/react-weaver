const path = require('path')

module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: ["/node_modules/(?!flatted)"],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '^kanopi-components(.*)$': 'kanopi-components/src$1',
    '^kw(.*)$': '<rootDir>/src$1',
  }
}
