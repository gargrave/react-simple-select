module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  resolver: 'jest-pnp-resolver',
  testMatch: ['<rootDir>/src/**/?(*.)spec.{ts,tsx}'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
}
