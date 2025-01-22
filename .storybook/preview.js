const preview = {
  argTypes: {
    value: { control: { type: 'number' } },
    keyframes: { control: { type: 'object' } },
    locale: { control: { type: 'text' } },
    animationOptions: { control: { type: 'object' } },
    'animation-options': { control: { type: 'object' } },
  },
  args: {
    // fontSize: 14,
  },
  parameters: {
    controls: {
      // expanded: true,
      // include: ['value'],
      // exclude: ['value'],
    },
  },
};

export default preview;
