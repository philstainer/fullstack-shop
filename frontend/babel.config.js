module.exports = {
  plugins: [
    ['styled-components', {ssr: true}],
    [
      'module-resolver',
      {
        alias: {
          '#root': './',
        },
      },
    ],
  ],
  presets: ['next/babel'],
}
