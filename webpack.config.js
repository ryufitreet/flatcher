const path = require('path');
const webpack = require('webpack');

const getEntry = ( env )=>{
    let entry="";
    if ( env && env.entry ) entry = `${env.entry}`;
    return entry;
}

module.exports = function( env ){

    const ENTRY = getEntry( env );

    let config = {
        entry: `./src/${ENTRY}index.js`,
        output: {
            filename: `${ENTRY}bundle.js`,
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules:[
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders:{
                            js: 'babel-loader'
                        }
                    }
                },
                {
                  test: /\.js$/,
                  loader: 'babel-loader',
                  exclude: /(node_modules)/
                }
            ]
        },
        watch: true
    }

    if ( process.env.NODE_ENV === 'production' ){
        config.devtool = '#source-map';
        config.plugins = (config.plugins || []).concat([
            new webpack.DefinePlugin({
                'process.env': {
                  NODE_ENV: '"production"'
                }
              }),
              new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                  warnings: false
                }
              }),
              new webpack.LoaderOptionsPlugin({
                minimize: true
              })
        ]);
    }

    return config;
};

module.exports.devtool = '#source-map';

