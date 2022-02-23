module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTests.js'],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>/config/jest/styleMock.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/assetMock.js',
  },
  testEnvironment: 'jsdom',
};
