const plugins = [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['./src'],
      extensions: [
        '.vue',
        '.ts',
        '.tsx',
        '.json'
      ],
      alias: {
        'views/*': './src/views/*',
        'components/*': './src/components/*',
        'assets/*': './src/assets/*',
        router: './src/router/index.ts',
        api: './src/api/wrapper.ts'
      }
    }
  ]
]

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: plugins
}
