import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';

const eslintConfig = [
    {
        ignores: ['.next/*', 'node_modules/*', 'dist/*', 'build/*', 'out/*', 'public/*', '.stylelintrc.js'],
    },
    ...nextConfig,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        plugins: {
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
                node: true,
            },
        },
        rules: {
            'sort-imports': 'off',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },
];

export default eslintConfig;
