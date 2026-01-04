// babel.config.cjs
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
    ],
    plugins: [
        // Transform import.meta.env to process.env for Jest compatibility
        function () {
            return {
                visitor: {
                    MetaProperty(path) {
                        if (
                            path.node.meta.name === 'import' &&
                            path.node.property.name === 'meta'
                        ) {
                            path.replaceWithSourceString(
                                '({ env: { API_BASE_URL: "http://localhost:3000", VITE_API_BASE_URL: "http://localhost:3000", MODE: "test", DEV: false, PROD: false } })'
                            );
                        }
                    },
                },
            };
        },
    ],
};
