const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname);
const mock = (name) => path.resolve(appDirectory, `src/mocks/${name}.web.ts`);

const babelLoaderConfiguration = {
  test: /\.(ts|tsx|js|jsx)$/,
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native'),
    path.resolve(appDirectory, 'node_modules/@react-native'),
    path.resolve(appDirectory, 'node_modules/react-native-screens'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-svg'),
    path.resolve(appDirectory, 'node_modules/react-native-modal'),
    path.resolve(appDirectory, 'node_modules/react-native-toast-message'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/react-native-web'),
    path.resolve(appDirectory, 'node_modules/nativewind'),
    path.resolve(appDirectory, 'node_modules/react-native-css-interop'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      configFile: false,
      babelrc: false,
      presets: [
        ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-native-web',
      ],
    },
  },
};

module.exports = {
  entry: path.resolve(appDirectory, 'index.web.js'),
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-linear-gradient': mock('linear-gradient'),
      'react-native-reanimated': mock('reanimated'),
      'react-native-gesture-handler': mock('gesture-handler'),
      'react-native-vision-camera': mock('vision-camera'),
      'react-native-haptic-feedback': mock('haptics'),
      'react-native-biometrics': mock('biometrics'),
      'react-native-mmkv': mock('mmkv'),
      'react-native-maps': mock('maps'),
      'react-native-skeleton-placeholder': mock('skeleton'),
      'lottie-react-native': mock('lottie'),
      'moti': mock('moti'),
      'moti/interactions': mock('moti'),
      '@gorhom/bottom-sheet': mock('bottom-sheet'),
      'react-native-progress': mock('progress'),
      'react-native-vector-icons/MaterialIcons': mock('icons'),
      'react-native-modal': mock('modal'),
      '@react-navigation/native-stack': mock('native-stack'),
      'react-native-toast-message': mock('toast'),
    },
  },
  module: {
    rules: [
      { test: /\.m?js$/, resolve: { fullySpecified: false } },
      babelLoaderConfiguration,
      {
        test: /\.(gif|jpe?g|png|svg|webp)$/,
        use: { loader: 'url-loader', options: { name: '[name].[ext]' } },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(appDirectory, 'public/index.html') }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      process: { env: { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') } },
    }),
  ],
  devServer: {
    static: path.resolve(appDirectory, 'public'),
    historyApiFallback: true,
    port: 8080,
  },
};
