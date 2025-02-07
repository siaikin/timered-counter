const config = {
  stories: ['../**/dist/stories/**/*.stories.{js,md,mdx}'],

  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
  ],

  docs: {},
};

export default config;
