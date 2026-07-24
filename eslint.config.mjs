import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier/flat';

const eslintConfig = [
    {
        ignores: ['.next/*', 'node_modules/*', 'dist/*', 'build/*', 'out/*', 'public/*', '.stylelintrc.js'],
    },
    ...nextConfig,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
                node: true,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            'sort-imports': 'off',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        {
                            target: './src/components',
                            from: './src/features',
                            message: 'Shared components cannot import from features.',
                        },
                        {
                            target: './src/lib',
                            from: './src/features',
                            message: 'Lib cannot import from features.',
                        },
                        {
                            target: './src/services',
                            from: './src/features',
                            message: 'Services cannot import from features.',
                        },
                        {
                            target: './src/contexts',
                            from: './src/features',
                            message: 'Contexts cannot import from features.',
                        },
                        {
                            target: './src/components',
                            from: './src/app',
                            message: 'Shared components cannot import from app.',
                        },
                        {
                            target: './src/lib',
                            from: './src/app',
                            message: 'Lib cannot import from app.',
                        },
                        {
                            target: './src/services',
                            from: './src/app',
                            message: 'Services cannot import from app.',
                        },
                        {
                            target: './src/contexts',
                            from: './src/app',
                            message: 'Contexts cannot import from app.',
                        },
                        {
                            target: './src/features',
                            from: './src/app',
                            message: 'Features cannot import from app.',
                        },
                    ],
                },
            ],
        },
    },
];

export default eslintConfig;
