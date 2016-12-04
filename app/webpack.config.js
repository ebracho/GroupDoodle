module.exports = {
  entry: __dirname + '/frontend/components/app.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
};
