module.exports = {
  entry: './addPost.tsx',
  output: { filename: 'addPost.js' },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  }
};