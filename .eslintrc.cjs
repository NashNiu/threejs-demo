module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    // Allow react-three-fiber props (args, position, rotation, etc.)
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          'args',
          'attach',
          'side',
          'position',
          'rotation',
          'ref',
          'receiveShadow',
          'castShadow',
          'roughness',
          'metalness',
          'wireframe',
          'intensity',
          'distance',
          'transparent',
          'opacity',
          'shadow-mapSize',
        ],
      },
    ],
  },
}
