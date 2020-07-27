
/** @type {import('webpack').Configuration} */
const cfg = {
  mode: 'development',
  devtool: false,
  context: __dirname,
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'react-reconciler.js',
    libraryTarget: "global",
  },
  externals: {
    react: 'React',
    scheduler: 'Scheduler',
    'prop-types': 'PropTypes',
  }
}

module.exports = cfg;
