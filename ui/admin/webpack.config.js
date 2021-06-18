const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * Get the config.
 * @param {string} mode The mode (development, production).
 */
const getConfig = (mode = 'development') => ({
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    entry: {
        app: './index.tsx',
    },

    // Define the output.
    output: {
        filename: 'main.20981f9a0f4f2e1b878ad5a1bf688c57f2c61b069570e6e0c85b06aac814adb0.js',
        path: path.resolve('../../public/js'),
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.css'],
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    path.resolve('../../node_modules')
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },

    // https://webpack.js.org/plugins/terser-webpack-plugin/
    optimization: mode === 'production' ? {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ]
    } : undefined,
    devtool: mode === 'production' ? 'eval-source-map' : undefined,

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {},
        }),
        new webpack.ProvidePlugin({
            'React': 'react',
        }),
        new webpack.ProvidePlugin({
            'ReactDOM': 'react-dom',
        }),
    ],

    mode,
});

const baseConfig = getConfig();
const prodConfig = getConfig('production');

module.exports = [baseConfig, prodConfig];